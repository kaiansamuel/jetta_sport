"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Copy, Pencil, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils/format";
import { toggleProductActive, deleteProduct, duplicateProduct } from "./actions";

export interface ProductRow {
  id: string;
  name: string;
  slug: string;
  price: number;
  isActive: boolean;
  brandName: string;
  categoryName: string;
  totalStock: number;
}

export function ProductsTable({ products }: { products: ProductRow[] }) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);

  const handleToggle = async (id: string, isActive: boolean) => {
    setPendingId(id);
    await toggleProductActive(id, !isActive);
    router.refresh();
    setPendingId(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir este produto?")) return;
    setPendingId(id);
    const result = await deleteProduct(id);
    if (result.error) alert(result.error);
    router.refresh();
    setPendingId(null);
  };

  const handleDuplicate = async (id: string) => {
    setPendingId(id);
    await duplicateProduct(id);
    router.refresh();
    setPendingId(null);
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-jetta-metal/15">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-jetta-metal/15 text-left text-xs tracking-wide text-jetta-metal uppercase">
            <th className="p-3">Produto</th>
            <th className="p-3">Marca</th>
            <th className="p-3">Categoria</th>
            <th className="p-3">Preço</th>
            <th className="p-3">Estoque</th>
            <th className="p-3">Status</th>
            <th className="p-3" />
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b border-jetta-metal/10">
              <td className="p-3 text-jetta-ice">{product.name}</td>
              <td className="p-3 text-jetta-metal">{product.brandName}</td>
              <td className="p-3 text-jetta-metal">{product.categoryName}</td>
              <td className="p-3 text-jetta-ice">{formatCurrency(product.price)}</td>
              <td className="p-3 text-jetta-metal">
                {product.totalStock === 0 ? (
                  <span className="text-jetta-red-text">Esgotado</span>
                ) : (
                  product.totalStock
                )}
              </td>
              <td className="p-3">
                <button
                  type="button"
                  disabled={pendingId === product.id}
                  onClick={() => handleToggle(product.id, product.isActive)}
                  className={
                    product.isActive
                      ? "rounded-full bg-jetta-blue/15 px-2 py-1 text-xs text-jetta-cyan-text"
                      : "rounded-full bg-jetta-metal/15 px-2 py-1 text-xs text-jetta-metal"
                  }
                >
                  {product.isActive ? "Ativo" : "Inativo"}
                </button>
              </td>
              <td className="p-3">
                <div className="flex items-center gap-1">
                  <Link
                    href={`/admin/produtos/${product.id}/editar`}
                    aria-label="Editar"
                    className="flex h-8 w-8 items-center justify-center text-jetta-metal hover:text-jetta-blue"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <button
                    type="button"
                    aria-label="Duplicar"
                    disabled={pendingId === product.id}
                    onClick={() => handleDuplicate(product.id)}
                    className="flex h-8 w-8 items-center justify-center text-jetta-metal hover:text-jetta-blue"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Excluir"
                    disabled={pendingId === product.id}
                    onClick={() => handleDelete(product.id)}
                    className="flex h-8 w-8 items-center justify-center text-jetta-metal hover:text-jetta-red"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {products.length === 0 && (
        <p className="p-6 text-center text-sm text-jetta-metal">Nenhum produto cadastrado.</p>
      )}
    </div>
  );
}
