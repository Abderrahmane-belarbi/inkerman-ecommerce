import { UserIcon } from 'lucide-react';
import Link from 'next/link';
import CartButton from './cart-button';

export default function Menu() {
  return (
    <div className='flex justify-end'>
      <nav className='flex items-center gap-3 w-full'>
        <Link href='/signin' className='header-button flex'>
          <UserIcon className='h-8 w-8' />
          <div className='flex flex-col gap-0 p-0'>
            <span className='p-0 text-sm font-bold flex items-end'>
              Sign in
            </span>
            <span className='p-0 text-[10px] font-bold flex items-end'>
              Sign up
            </span>
          </div>
        </Link>
        <CartButton />
      </nav>
    </div>
  );
}
