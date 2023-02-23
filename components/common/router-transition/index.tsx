/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams, useRouter, useServerInsertedHTML } from "next/navigation";
import {
  startNavigationProgress,
  completeNavigationProgress,
  NavigationProgress,
} from '@mantine/nprogress';

export function RouterTransition() {
  const router = useRouter()
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    let newPageViewPath: string | undefined;

    const handleStart = (url: string) => startNavigationProgress();
    const handleComplete = () => completeNavigationProgress();

    if (pathname) {
      newPageViewPath = pathname + searchParams.toString();
      // Fathom.trackPageview({
      //   url: newPageViewPath,
      //   referrer: document.referrer,
      // });
      handleStart(newPageViewPath)
    }else{
      handleComplete()
    }

    // router.events.on('routeChangeStart', handleStart);
    // router.events.on('routeChangeComplete', handleComplete);
    // router.events.on('routeChangeError', handleComplete);


    // return () => {
    //   router.events.off('routeChangeStart', handleStart);
    //   router.events.off('routeChangeComplete', handleComplete);
    //   router.events.off('routeChangeError', handleComplete);
    // };
  }, [pathname, searchParams]);

  return <NavigationProgress autoReset={true} />;
}