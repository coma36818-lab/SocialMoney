
'use client';
import Head from 'next/head';
import { useEffect } from 'react';

export default function LikeFlowPage() {
  useEffect(() => {
    window.location.href = '/likeflow/feed';
  }, []);

  return (
    <>
      <Head>
        <title>LikeFlow</title>
      </Head>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center text-white">Redirecting to LikeFlow...</h1>
      </div>
    </>
  );
}

    