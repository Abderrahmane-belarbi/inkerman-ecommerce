import React from 'react';
import { Star } from 'lucide-react';

export default function Rating({
  rating = 0, // A number between 0 and 5 representing the rating.
  size = 6, // Determines the size of the stars (w-size h-size in Tailwind).
}: {
  rating: number;
  size?: number;
}) {
  // we take only the field stars
  // Rating           Math.floor(rating) (full stars)
  //   3.7	                3 (3 full stars)
  //   4.9                	4 (4 full stars)
  const fullStars = Math.floor(rating);

  // Same as rating MOD 1 => means take natural number devided by 1 and the result will be the rest
  // Ex 2.5 => 2 / 1 and the rest is 0.5 Ex: 3.9 => 3 / 1 and the rest is 0.9
  // that means we take only the star that its not full and not empty, half star fulled for example or theird star ect
  const partialStar = rating % 1;

  // We take only the empty stars
  //    rating	      Math.ceil(rating)         	emptyStars = 5 - Math.ceil(rating)
  //      3.7	              4	                         5 - 4 = 1 (1 empty star)
  //      4.9	              5                          5 - 5 = 0 (No empty stars)
  //      2.2	              3                          5 - 3 = 2 (2 empty stars)
  const emptyStars = 5 - Math.ceil(rating);

  return (
    <div
      className='flex items-center'
      aria-label={`Rating: ${rating} out of 5 stars`}
    >
      {[...Array(fullStars)].map((_, i) => (
        <Star
          key={`full-${i}`}
          className={`w-${size} h-${size} fill-primary text-primary`}
        />
      ))}
      {partialStar > 0 && (
        <div className='relative'>
          <Star className={`w-${size} h-${size} text-primary`} />
          <div
            className='absolute top-0 left-0 overflow-hidden'
            style={{ width: `${partialStar * 100}%` }}
          >
            <Star className='w-6 h-6 fill-primary text-primary' />
          </div>
        </div>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star
          key={`empty-${i}`}
          className={`w-${size} h-${size}  text-primary`}
        />
      ))}
    </div>
  );
}
