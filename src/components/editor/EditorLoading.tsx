"use client";
import { useTranslation } from "@/components/i18n/LocaleProvider";
export function EditorLoading() {
 const t = useTranslation();
 return <main className="flex min-h-screen items-center justify-center bg-mist px-5"><div role="status" className="rounded-lg border border-line bg-white p-6 text-center"><div>{t("Opening PDF editor...")}</div><div>{t("Preparing your workspace.")}</div></div></main>;
}
