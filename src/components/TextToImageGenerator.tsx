"use client";

import React, { useState, useEffect, useRef } from "react";
import { HexColorPicker } from "react-colorful";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import Link from "next/link";

export function TextToImageGenerator() {
  const [bgColor, setBgColor] = useState("#ffffff");
  const [text, setText] = useState("Your next image with text!");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    generateImage();
  }, [bgColor, text]);

  const generateImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size (increased for better quality)
    canvas.width = 300;
    canvas.height = 300;

    // Scale the context to match the increased size
    ctx.scale(1, 1);

    // Draw background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, 300, 300);

    // Draw text
    ctx.fillStyle = getContrastColor(bgColor);
    ctx.font = `bold 24px Arial, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Word wrap
    const words = text.split(" ");
    let line = "";
    let y = 150;
    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + " ";
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > 280 && i > 0) {
        ctx.fillText(line, 150, y);
        line = words[i] + " ";
        y += 30;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 150, y);

    // Reset the scale for future drawings
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  };

  const getContrastColor = (hexColor: string) => {
    // Convert hex to RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);

    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // Return black for light colors, white for dark colors
    return luminance > 0.5 ? "#000000" : "#ffffff";
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create a temporary link element
    const link = document.createElement("a");
    link.download = "generated-image.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="container mx-auto p-4 flex justify-center my-auto">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            Box Text Images for X (formerly Twitter) or Threads
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="text-input">Enter Text</Label>
            <Input
              id="text-input"
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text for the image"
              maxLength={20}
            />
            <small className="text-gray-500">
              Max 20 characters, including spaces
            </small>
          </div>
          <div>
            <Label>Choose Background Color</Label>
            <HexColorPicker color={bgColor} onChange={setBgColor} />
          </div>
          <div>
            <Label>Generated Image</Label>
            <canvas
              ref={canvasRef}
              className={`w-full h-auto border border-gray-300 rounded `}
            />
          </div>
          <Button onClick={handleDownload} className="w-full">
            <Download className="mr-2 h-4 w-4" /> Download Image
          </Button>
          <small className="text-gray-500">
            Made with ❤️ by{" "}
            <Link href="https://x.com/LoconLuis" target="__blank">
              @LoconLuis
            </Link>
          </small>
        </CardContent>
      </Card>
    </div>
  );
}
