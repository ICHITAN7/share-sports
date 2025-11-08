"use client";
import { useState, useEffect } from "react";

export default function NewsPage() {

  useEffect(() => {}, []);

  return (
    <section className="home-page">
      <div className="video-home-banner">
        <video
          src="https://sharesport.news/banner/sharesportbanner.mp4"
          autoPlay
          loop
          muted
        />
      </div>
      <div className="video-home-banner">
        <video
          src="https://sharesport.news/banner/sharesportbanner.mp4"
          autoPlay
          loop
          muted
        />
      </div>
      <div className="video-home-banner">
        <video
          src="https://sharesport.news/banner/sharesportbanner.mp4"
          autoPlay
          loop
          muted
        />
      </div>
    </section>
  );
}
