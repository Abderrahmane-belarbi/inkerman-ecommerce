'use client';

import * as React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import ProductCard from './product-card';
import { IProduct } from '@/lib/db/models/product.model';

export default function ProductSlider({
  title,
  products,
  hideDetails = false,
}: {
  title?: string;
  products: IProduct[];
  hideDetails?: boolean;
}) {
  return (
    <div className='w-full bg-background'>
      <h2 className='h2-bold mb-5'>{title}</h2>
      <Carousel
        opts={{
          align: 'start',
        }}
        className='w-full'
      >
        <CarouselContent>
          {products.map((product) => (
            <CarouselItem
              key={product.slug}
              className={
                hideDetails
                  ? 'md:basis-1/4 lg:basis-1/6' // md: basis-1/4 → 25% width (4 items per row). lg: basis-1/6 → 16.66% width (6 items per row)
                  : 'md:basis-1/3 lg:basis-1/5' // md: basis-1/3 → 33.33% width (3 items per row). lg: basis-1/5 → 20% width (5 items per row)
              }
            >
              <ProductCard
                hideDetails={hideDetails}
                hideAddToCart
                hideBorder
                product={product}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* CarouselPrevious and CarouselNext are buttons that can be used to navigate the carousel and left-0 and right-0 are used to position the buttons on the left and right side of the carousel */}
        <CarouselPrevious className='left-0' />
        <CarouselNext className='right-0' />
      </Carousel>
    </div>
  );
}
