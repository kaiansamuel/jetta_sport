"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Trash2, Upload } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export interface UploaderImage {
  url: string;
  altText?: string;
}

export function ImageUploader({
  images,
  onChange,
  folder = "products",
}: {
  images: UploaderImage[];
  onChange: (images: UploaderImage[]) => void;
  folder?: string;
}) {
  const [urlInput, setUrlInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addUrl = () => {
    if (!urlInput.trim()) return;
    onChange([...images, { url: urlInput.trim() }]);
    setUrlInput("");
  };

  const removeAt = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);
      const response = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Falha ao enviar a imagem.");
        return;
      }
      onChange([...images, { url: data.url }]);
    } catch {
      setError("Falha ao enviar a imagem.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {images.map((image, index) => (
          <div key={image.url + index} className="relative h-24 w-24 overflow-hidden rounded-lg border border-jetta-metal/20">
            <Image src={image.url} alt={image.altText ?? ""} fill sizes="96px" className="object-cover" />
            <button
              type="button"
              onClick={() => removeAt(index)}
              aria-label="Remover imagem"
              className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-jetta-black/80 text-jetta-red"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-3 flex gap-2">
        <Input
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="Colar URL da imagem"
        />
        <Button type="button" variant="ghost" onClick={addUrl}>
          Adicionar
        </Button>
      </div>

      <div className="mt-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="image-upload-input"
        />
        <label
          htmlFor="image-upload-input"
          className="inline-flex cursor-pointer items-center gap-2 text-xs text-jetta-blue-text hover:underline"
        >
          <Upload className="h-3.5 w-3.5" />
          {uploading ? "Enviando..." : "ou enviar arquivo (requer Supabase configurado)"}
        </label>
      </div>

      {error && <p className="mt-2 text-xs text-jetta-red">{error}</p>}
    </div>
  );
}
