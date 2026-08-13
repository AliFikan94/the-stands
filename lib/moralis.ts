// lib/moralis.ts
import { default as Moralis } from 'moralis';

let moralisStarted = false;

export const initMoralis = async () => {
  if (!moralisStarted) {
    await Moralis.start({
      apiKey: process.env.NEXT_PUBLIC_MORALIS_API_KEY!,
    });
    moralisStarted = true;
  }
  return Moralis;
};