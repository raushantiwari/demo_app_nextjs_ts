import Image from 'next/image';
import Link from 'next/link';
import styles from './Home.module.scss';
import { getServerCookie } from '@/utils/cookies.helper';

export default async function Home() {
  const authToken = await getServerCookie('ttn_token');
  const url = authToken ? '/members' : 'signin';
  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary">
      <div className="w-[35rem] rounded-2xl bg-white shadow-2xl p-10 flex flex-col items-center">
        <div className="mb-7 flex flex-col items-center">
          <Image
            src="/images/demo-app-logo.webp"
            alt="To The New Logo"
            height={70}
            width={150}
            className="mb-4"
          />
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">
            Welcome to admin Portal!
          </h1>
        </div>
        <Link href={url} className={styles.link}>
          <button
            type="button"
            className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg shadow px-7 py-3 font-semibold text-base transition mt-8"
            style={{ boxShadow: '0 8px 40px 0 #a21caf33' }} // optional for extra shadow
          >
            <Image
              alt="Google Icon"
              height={22}
              width={22}
              src="/images/google.ef8c5c58996f6a28f453.png"
              className=""
            />
            { authToken ? 'You are logged in!' : 'LOGIN WITH GOOGLE' }
          </button>
        </Link>
      </div>
    </div>
  );
}
