"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Ellipse, Image as KonvaImage, Layer, Line, Rect, Stage, Text, Transformer } from "react-konva";
import type Konva from "konva";
import { useEditorStore } from "@/store/editorStore";
import type { EditorObject, PageState, Point } from "@/types/editor";
import {
  createDrawingObject,
  createHighlightObject,
  createLineObject,
  createShapeObject,
  createTextObject,
} from "@/lib/editor/objectUtils";
import { loadImage } from "@/lib/editor/fileUtils";
import { normalizeDragRect } from "@/lib/pdf/coordinateUtils";

type DraftRect = { x: number; y: number; width: number; height: number; kind: "highlight" | "rectangle" | "circle" | "line" };

export function ObjectOverlay({ page, zoom }: { page: PageState; zoom: number }) {
  const stageRef = useRef<Konva.Stage | null>(null);
  const transformerRef = useRef<Konva.Transformer | null>(null);
  const selectedObjectId = useEditorStore((state) => state.selectedObjectId);
  const tool = useEditorStore((state) => state.tool);
  const addObject = useEditorStore((state) => state.addObject);
  const updateObject = useEditorStore((state) => state.updateObject);
  const selectObject = useEditorStore((state) => state.selectObject);
  const [drawPoints, setDrawPoints] = useState<Point[]>([]);
  const [draftStart, setDraftStart] = useState<Point | null>(null);
  const [draftRect, setDraftRect] = useState<DraftRect | null>(null);

  const selectedObject = useMemo(
    () => page.objects.find((object) => object.id === selectedObjectId),
    [page.objects, selectedObjectId],
  );

  useEffect(() => {
    const transformer = transformerRef.current;
    const stage = stageRef.current;
    if (!transformer || !stage) return;
    const node = selectedObjectId ? stage.findOne(`#${selectedObjectId}`) : null;
    transformer.nodes(node ? [node] : []);
    transformer.getLayer()?.batchDraw();
  }, [selectedObjectId, selectedObject]);

  function pointer() {
    const position = stageRef.current?.getPointerPosition();
    if (!position) return null;
    return { x: position.x / zoom, y: position.y / zoom };
  }

  function handlePointerDown(event: Konva.KonvaEventObject<PointerEvent>) {
    const point = pointer();
    if (!point) return;
    const clickedStage = event.target === event.target.getStage();

    if (tool === "select") {
      if (clickedStage) selectObject(null);
      return;
    }

    if (tool === "text" && clickedStage) {
      addObject(createTextObject({ page, x: point.x, y: point.y }));
      return;
    }

    if (tool === "draw") {
      setDrawPoints([point]);
      return;
    }

    if (["highlight", "rectangle", "circle", "line"].includes(tool)) {
      setDraftStart(point);
      setDraftRect({ x: point.x, y: point.y, width: 1, height: 1, kind: tool as DraftRect["kind"] });
    }
  }

  function handlePointerMove() {
    const point = pointer();
    if (!point) return;
    if (tool === "draw" && drawPoints.length) {
      setDrawPoints((current) => [...current, point]);
      return;
    }
    if (draftStart && draftRect) {
      setDraftRect({ ...normalizeDragRect(draftStart, point), kind: draftRect.kind });
    }
  }

  function handlePointerUp() {
    if (tool === "draw" && drawPoints.length > 1) {
      addObject(
        createDrawingObject({
          page,
          points: drawPoints,
          strokeColor: "#1976d2",
          strokeWidth: 3,
        }),
      );
    }
    if (draftRect && draftRect.width > 4 && draftRect.height > 4) {
      if (draftRect.kind === "highlight") {
        addObject(createHighlightObject({ page, ...draftRect }));
      } else if (draftRect.kind === "line") {
        addObject(createLineObject({ page, ...draftRect }));
      } else {
        addObject(createShapeObject({ page, ...draftRect, type: draftRect.kind }));
      }
    }
    setDrawPoints([]);
    setDraftStart(null);
    setDraftRect(null);
  }

  return (
    <Stage
      ref={stageRef}
      width={page.width * zoom}
      height={page.height * zoom}
      className="absolute left-0 top-0"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <Layer scaleX={zoom} scaleY={zoom}>
        {[...page.objects]
          .sort((a, b) => a.zIndex - b.zIndex)
          .map((object) => (
            <EditorObjectNode
              key={object.id}
              object={object}
              selected={object.id === selectedObjectId}
              onSelect={() => selectObject(object.id)}
              onChange={(patch, trackHistory = true) => updateObject(object.id, patch, trackHistory)}
            />
          ))}

        {drawPoints.length > 1 && (
          <Line
            points={drawPoints.flatMap((point) => [point.x, point.y])}
            stroke="#1976d2"
            strokeWidth={3}
            lineCap="round"
            lineJoin="round"
          />
        )}

        {draftRect && draftRect.kind !== "line" && (
          <Rect
            x={draftRect.x}
            y={draftRect.y}
            width={draftRect.width}
            height={draftRect.height}
            fill={draftRect.kind === "highlight" ? "#fde047" : "rgba(255,255,255,0.18)"}
            opacity={draftRect.kind === "highlight" ? 0.35 : 1}
            stroke={draftRect.kind === "highlight" ? "#eab308" : "#1976d2"}
            strokeWidth={2}
          />
        )}

        {draftRect?.kind === "line" && (
          <Line
            points={[draftRect.x, draftRect.y, draftRect.x + draftRect.width, draftRect.y + draftRect.height]}
            stroke="#1976d2"
            strokeWidth={3}
            lineCap="round"
          />
        )}

        <Transformer
          ref={transformerRef}
          rotateEnabled
          ignoreStroke
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 8 || newBox.height < 8) return oldBox;
            return newBox;
          }}
        />
      </Layer>
    </Stage>
  );
}

function EditorObjectNode({
  object,
  selected,
  onSelect,
  onChange,
}: {
  object: EditorObject;
  selected: boolean;
  onSelect: () => void;
  onChange: (patch: Partial<EditorObject>, trackHistory?: boolean) => void;
}) {
  const common = {
    id: object.id,
    x: object.x,
    y: object.y,
    width: object.width,
    height: object.height,
    rotation: object.rotation,
    opacity: object.opacity,
    draggable: true,
    onClick: (event: Konva.KonvaEventObject<MouseEvent>) => {
      event.cancelBubble = true;
      onSelect();
    },
    onTap: (event: Konva.KonvaEventObject<TouchEvent>) => {
      event.cancelBubble = true;
      onSelect();
    },
    onDragEnd: (event: Konva.KonvaEventObject<DragEvent>) => {
      onChange({ x: event.target.x(), y: event.target.y() } as Partial<EditorObject>);
    },
    onTransformEnd: (event: Konva.KonvaEventObject<Event>) => {
      const node = event.target;
      const scaleX = node.scaleX();
      const scaleY = node.scaleY();
      node.scaleX(1);
      node.scaleY(1);
      onChange({
        x: node.x(),
        y: node.y(),
        width: Math.max(8, node.width() * scaleX),
        height: Math.max(8, node.height() * scaleY),
        rotation: node.rotation(),
      } as Partial<EditorObject>);
    },
  };

  if (object.type === "text") {
    return (
      <Text
        {...common}
        text={object.text}
        fontSize={object.fontSize}
        fontStyle={`${object.italic ? "italic" : ""} ${object.fontWeight ?? (object.bold ? 700 : 400)}`}
        fontFamily={object.fontFamily || "Helvetica, Arial, sans-serif"}
        letterSpacing={object.characterSpacing}
        fill={object.color}
        align={object.alignment}
        padding={2}
        onDblClick={() => {
          const text = window.prompt("Edit text", object.text);
          if (text !== null) onChange({ text } as Partial<EditorObject>);
        }}
      />
    );
  }

  if (object.type === "image" || object.type === "signature") {
    return <ImageNode object={object} selected={selected} common={common} />;
  }

  if (object.type === "drawing") {
    return (
      <Line
        {...common}
        width={undefined}
        height={undefined}
        points={object.points.flatMap((point) => [point.x, point.y])}
        stroke={object.strokeColor}
        strokeWidth={object.strokeWidth}
        lineCap="round"
        lineJoin="round"
      />
    );
  }

  if (object.type === "highlight") {
    return <Rect {...common} fill={object.fillColor} opacity={object.opacity} />;
  }

  if (object.type === "rectangle") {
    return (
      <Rect
        {...common}
        fill={object.fillColor.endsWith("00") ? undefined : object.fillColor}
        stroke={object.strokeColor}
        strokeWidth={object.strokeWidth}
      />
    );
  }

  if (object.type === "circle") {
    return (
      <Ellipse
        id={object.id}
        x={object.x + object.width / 2}
        y={object.y + object.height / 2}
        radiusX={object.width / 2}
        radiusY={object.height / 2}
        rotation={object.rotation}
        opacity={object.opacity}
        draggable
        fill={object.fillColor.endsWith("00") ? undefined : object.fillColor}
        stroke={object.strokeColor}
        strokeWidth={object.strokeWidth}
        onClick={(event) => {
          event.cancelBubble = true;
          onSelect();
        }}
        onTap={(event) => {
          event.cancelBubble = true;
          onSelect();
        }}
        onDragEnd={(event) => {
          onChange({
            x: event.target.x() - object.width / 2,
            y: event.target.y() - object.height / 2,
          } as Partial<EditorObject>);
        }}
        onTransformEnd={(event) => {
          const node = event.target;
          const nextWidth = Math.max(8, object.width * node.scaleX());
          const nextHeight = Math.max(8, object.height * node.scaleY());
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            x: node.x() - nextWidth / 2,
            y: node.y() - nextHeight / 2,
            width: nextWidth,
            height: nextHeight,
            rotation: node.rotation(),
          } as Partial<EditorObject>);
        }}
      />
    );
  }

  if (object.type === "line") {
    return (
      <Line
        {...common}
        width={undefined}
        height={undefined}
        points={object.points}
        stroke={object.strokeColor}
        strokeWidth={object.strokeWidth}
        lineCap="round"
      />
    );
  }

  return null;
}

function ImageNode({
  object,
  common,
}: {
  object: Extract<EditorObject, { type: "image" | "signature" }>;
  selected: boolean;
  common: Record<string, unknown>;
}) {
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    let mounted = true;
    void loadImage(object.src).then((loaded) => {
      if (mounted) setImage(loaded);
    });
    return () => {
      mounted = false;
    };
  }, [object.src]);

  return <KonvaImage {...common} image={image ?? undefined} />;
}
