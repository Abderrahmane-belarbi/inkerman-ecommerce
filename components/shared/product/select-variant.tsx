import { Button } from '@/components/ui/button';
import { IProduct } from '@/lib/db/models/product.model';
import Link from 'next/link';

export default function SelectVariant({
  product,
  size,
  color,
}: {
  product: IProduct;
  color: string;
  size: string;
}) {
  const selectedColor = color || product.colors[0];
  const selectedSize = size || product.sizes[0];

  return (
    <>
      {product.colors.length > 0 && (
        <div className='space-x-2 space-y-2'>
          <div>Color:</div>
          {product.colors.map((x: string) => (
            <Button
              key={x}
              asChild // Normally, if you wrap a <Button> around a <Link>, it won't inherit the styles correctly. By using asChild, the Button component does not render a <button> tag, but instead delegates its styles and behavior to the child component.
              variant='outline'
              className={
                selectedColor === x ? 'border-2 border-primary' : 'border-2'
              }
            >
              <Link
                key={x}
                // The replace prop in Next.js <Link> prevents adding a new entry to the browser's history when navigating. Instead of pushing a new URL to the history stack, it replaces the current entry.
                // By default, when you navigate using <Link>, Next.js adds the new URL to the browser's history.
                // But if you use the replace prop, Clicking "Back" does not go back to the previous page (because it's replaced).
                replace
                // Default behavior (scroll={true}) → The page scrolls to the top when you navigate.
                // When scroll={false} → The page stays at the current scroll position.
                scroll={false}
                href={`?${new URLSearchParams({
                  color: x,
                  size: selectedSize,
                })}`}
              >
                <div
                  style={{ backgroundColor: x }}
                  className='h-4 w-4 rounded-full border border-muted-foreground'
                ></div>
                {x}
              </Link>
            </Button>
          ))}
        </div>
      )}
      {product.sizes.length > 0 && (
        <div className='mt-2 space-x-2 space-y-2'>
          <div>Size:</div>
          {product.sizes.map((x: string) => (
            <Button
              asChild
              variant='outline'
              className={
                selectedSize === x ? 'border-2  border-primary' : 'border-2  '
              }
              key={x}
            >
              <Link
                replace
                scroll={false}
                href={`?${new URLSearchParams({
                  color: selectedColor,
                  size: x,
                })}`}
              >
                {x}
              </Link>
            </Button>
          ))}
        </div>
      )}
    </>
  );
}
