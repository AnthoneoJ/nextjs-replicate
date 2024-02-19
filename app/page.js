"use client";
import { useState } from "react";
import Head from "next/head";
import styles from "./page.module.css";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function Home() {
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: e.target.imgUrl.value,
        prompt: e.target.prompt.value,
      }),
    });
    let prediction = await response.json();
    if (response.status !== 201) {
      setError(prediction.detail);
      return;
    }
    setPrediction(prediction);

    while (
      prediction.status !== "succeeded" &&
      prediction.status !== "failed"
    ) {
      await sleep(1000);
      const response = await fetch("/api/predictions/" + prediction.id);
      prediction = await response.json();
      if (response.status !== 200) {
        setError(prediction.detail);
        return;
      }
      setPrediction(prediction);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Replicate + Next.js</title>
      </Head>

      <p>
        Large Vision Language model - {" "}
        <a href="https://replicate.com/lucataco/qwen-vl-chat">QWEN-VL-CHAT</a>:
      </p>

      <form className={styles.form} onSubmit={handleSubmit}>
        <input type="text" name="imgUrl" placeholder="Enter image url here" />
        <input type="text" name="prompt" placeholder="Enter text prompt here" />
        <button type="submit">Go!</button>
      </form>

      {error && <div>{error}</div>}

      {prediction && (
        <div>
          <p>Output: {prediction.output}</p>
          <p>Status: {prediction.status}</p>
        </div>
      )}
    </div>
  );
}
