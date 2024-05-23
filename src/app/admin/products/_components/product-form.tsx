"use client";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { formatCurrency } from "@/src/lib/formatters";
import { useState } from "react";
import { addProduct, updateProduct } from "../../_actions/products";
import { useFormState, useFormStatus } from "react-dom";
import { Product } from "@prisma/client";
import Image from "next/image";

export function ProductForm({ product }: { product?: Product | null }) {
  const [priceInCents, setPriceInCents] = useState<number | undefined>(
    product?.priceInCents
  );
  const [error, action] = useFormState(
    product == null ? addProduct : updateProduct.bind(null, product.id),
    {}
  );

  return (
    <form action={action} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          type="text"
          id="name"
          name="name"
          required
          defaultValue={product?.name || ""}
        />
        {error.name && <p className="text-destructive">{error.name}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="priceInCents">Price in Cents</Label>
        <Input
          type="number"
          id="priceInCents"
          name="priceInCents"
          required
          value={priceInCents}
          onChange={(e) => setPriceInCents(Number(e.target.value) || undefined)}
        />
        <p className="text-muted-foreground">
          {formatCurrency((priceInCents || 0) / 100)}
        </p>
        {error.priceInCents && (
          <p className="text-destructive">{error.priceInCents}</p>
        )}
      </div>

      <div className="space-y-2 col-span-full">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          required
          defaultValue={product?.description || ""}
        />
        {error.description && (
          <p className="text-destructive">{error.description}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="file">File</Label>
        <Input type="file" id="file" name="file" required={product == null} />
        {product != null && (
          <p className="text-muted-foreground">{product.filePath}</p>
        )}

        {error.file && <p className="text-destructive">{error.file}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Image</Label>
        <Input type="file" id="image" name="image" required={product == null} />
        {product != null && (
          <Image
            src={product.imagePath}
            width={200}
            height={200}
            alt="Product Image"
          />
        )}
        {error.image && <p className="text-destructive">{error.image}</p>}
      </div>

      <Button2 />
    </form>
  );
}
const Button2 = () => {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="col-span-full">
      {pending ? "Saving..." : "Save"}
    </Button>
  );
};
