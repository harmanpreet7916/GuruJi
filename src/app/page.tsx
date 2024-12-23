import Navbar from './components/Navbar';
import ProductPage from './components/Product';

export default function Home() {
  return (
    <main className="w-screen min-h-screen flex flex-col items-center bg-gray-900">
      <div className='sticky top-0 z-50 w-full '>
        <Navbar />
      </div>
      <div className='flex-grow overflow-x-hidden w-full '>
        <ProductPage />
      </div>
    </main>
  );
}

