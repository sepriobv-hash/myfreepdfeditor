import { test, expect } from '@playwright/test';
import { PDFDocument } from 'pdf-lib';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { createDigitalPdf } from './fixtures';

test('reproducible compression samples produce valid PDFs and measured sizes', async ({page}) => {
 test.setTimeout(180_000);
 const rows=[];
 for(const kind of ['text','image'] as const) {
  const pdf=await PDFDocument.create();
  pdf.setCreationDate(new Date('2026-01-01T00:00:00Z'));pdf.setModificationDate(new Date('2026-01-01T00:00:00Z'));
  const sheet=pdf.addPage([612,792]);
  if(kind==='text') sheet.drawText('Reproducible invoice sample 104', {x:60,y:700,size:18});
  else {
   const sharp=(await import('sharp')).default;
   const pixels=Buffer.alloc(1200*1600*3);
   for(let y=0;y<1600;y++) for(let x=0;x<1200;x++) { const i=(y*1200+x)*3;pixels[i]=x%256;pixels[i+1]=y%256;pixels[i+2]=(x+y)%256; }
   const png=await sharp(pixels,{raw:{width:1200,height:1600,channels:3}}).png().toBuffer();
   const image=await pdf.embedPng(png);sheet.drawImage(image,{x:0,y:0,width:612,height:792});
  }
  const input=Buffer.from(await pdf.save({useObjectStreams: false}));
  for(const mode of ['Strong','Balanced','High quality']) {
   await page.goto('/compress-pdf');
   await page.locator('input[type="file"]').setInputFiles({name:`${kind}.pdf`,mimeType:'application/pdf',buffer:input});
   await page.getByRole('slider').fill(String(['Strong','Balanced','High quality'].indexOf(mode)+1));
   const pending=page.waitForEvent('download');await page.getByRole('button',{name:'Compress PDF',exact:true}).click();
   const result=await pending;const output=await readFile((await result.path())!);
   expect((await PDFDocument.load(output)).getPageCount()).toBe(1);
   expect(output.length).toBeLessThanOrEqual(input.length);
   rows.push({sample:kind,mode,inputBytes:input.length,outputBytes:output.length});
  }
 }
 await mkdir('test-results',{recursive:true});await writeFile('test-results/compression-measurements.json',JSON.stringify(rows,null,2));
});

test('Dutch mobile signature and page changes export a valid document',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto('/nl/editor');await page.reload();
 await page.locator('input[type="file"][accept*="application/pdf"]').setInputFiles({name:'pages.pdf',mimeType:'application/pdf',buffer:await createDigitalPdf(3)});
 await expect(page.getByRole('button',{name:'Downloaden',exact:true})).toBeVisible();
 await page.getByTitle('Handtekening',{exact:true}).click();
 const canvas=page.getByRole('dialog').locator('canvas');const box=(await canvas.boundingBox())!;
 await page.mouse.move(box.x+30,box.y+30);await page.mouse.down();await page.mouse.move(box.x+100,box.y+60,{steps:8});await page.mouse.up();
 await page.screenshot({path:'test-results/mobile-signature.png'});
 await page.getByRole('dialog').getByRole('button',{name:'Handtekening toevoegen',exact:true}).click();
 await page.getByTitle('Pagina omlaag',{exact:true}).first().click();
 page.once('dialog',dialog=>dialog.accept());
 await page.getByTitle('Pagina verwijderen',{exact:true}).last().click();
 const pending=page.waitForEvent('download');await page.getByRole('button',{name:'Downloaden',exact:true}).click();
 const output=await readFile((await (await pending).path())!);
 expect((await PDFDocument.load(output)).getPageCount()).toBe(2);
 await page.screenshot({path:'test-results/mobile-editor.png'});
});
