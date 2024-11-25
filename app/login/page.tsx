'use client'

import { LoginForm } from "@/components/ui/login-form"
import { SparklesCore } from "@/components/ui/sparkles"
import Image from 'next/image';

// Move the playerImages arrays here
const playerImages = [
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRr5fEqmxkS7bDVlRB2g9DqLnezKF-AbXMHWA&s',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSS4XbQB951vS99zXOWkrs9RtbDOBpo1DMW3A&s',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRr0Vv87RB-Ce_Gmbrx0aFXQEkVIFNDom8SEg&s',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxdTfwB5wdIurh9FC378rRcokoERLOv-wyzg&s',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTy1qe5HrdFFqULPIvTtABV_XjfJ1cjgkHT7Q&s',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMpkeUffqnTVblOUj5rQWAC0CKEyte2Aen9w&s',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8E1yYn9ohatDUOP-7svIljcMB3gj6CSglwg&s',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTE1KDS6p2htOV8HKjX3i8Rwnm8MdVbYsoMPA&s',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTu1FN2MatrheA6CAXtM7XZaIgZvwkv8wy1mQ&s',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThH-4niNzMKdvcxv1mC4uxSscJu9NHo1bZMQ&s',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGGJGXnba54QophwS0CKYz7gLZKqnwdQl_2w&s',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGXWIqdhfl-rcBHevu6quL5TKp8oPHTv7Cwg&s',
  // Add more player images as needed
];

const playerImages2 = [
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRk5o1XnOmdCfI_lwklkJbwEIgy6-ETxFchg&s',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6CraUlCu7cig_OwQs4NnPT10nkXWrLIAlWw&s',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVQHPn5ENec6zwwJNIgMPLgJTh7sD9oK2pjw&s',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSU-9c31W5tRNWVNNJl13GLfsdONwvVCuOMnw&s',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPWvgERo7lvB_4Fm_GovxQLv9uddL_BkSi3A&s',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9s3q8oWqID00SFTgcp_N8xSebKBX73mA-LQ&s',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1JQBa3Ljtdew0pypy0geo_kag2fCMEIzWww&s',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgQQ9Beey72WFfKso0m-Yl8n8HCpuL4HgUmg&s',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQobPZdSaEFUgA4-tXWC3YpND0bOWxZ8azQEA&s',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSM2PAVKkYCqDwArA_ODYQSCVIIdqTR1MOpow&s',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoZYBzqUNsniz4hGvxCiGhqe7-gprMgvd4Fg&s',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlXa7y7AFGU4iSQQyp9KXAnJfiCh6tDs2OXQ&s',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxfVd4U5QrJM1WClNnaC_XJg5Yg-8HrNmLdQ&s',
]

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-theme-dark relative overflow-hidden">
      <div className="fixed inset-0 w-full h-full pointer-events-none">
        <SparklesCore
          background="transparent"
          minSize={0.4}
          maxSize={1}
          particleDensity={1200}
          className="w-full h-full"
          particleColor="#00DF81"
        />
      </div>

      <div className="fixed inset-0 px-[5%] grid grid-cols-4 gap-4 opacity-60 pointer-events-none">
        <div className="flex flex-col gap-4 animate-scroll-up will-change-transform">
          {playerImages.map((src, imgIndex) => (
            <div
              key={`col1-${imgIndex}`}
              className="relative h-64 rounded-lg overflow-hidden"
            >
              <Image src={src} alt={`Soccer player ${imgIndex + 1}`} fill className="object-cover" />
            </div>
          ))}
          {playerImages.map((src, imgIndex) => (
            <div
              key={`col1-duplicate-${imgIndex}`}
              className="relative h-64 rounded-lg overflow-hidden"
            >
              <Image src={src} alt={`Soccer player ${imgIndex + 1}`} fill className="object-cover" />
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 animate-scroll-down will-change-transform">
          {playerImages2.map((src, imgIndex) => (
            <div
              key={`col2-${imgIndex}`}
              className="relative h-64 rounded-lg overflow-hidden"
            >
              <Image src={src} alt={`Soccer player ${imgIndex + 1}`} fill className="object-cover" />
            </div>
          ))}
          {playerImages2.map((src, imgIndex) => (
            <div
              key={`col2-duplicate-${imgIndex}`}
              className="relative h-64 rounded-lg overflow-hidden"
            >
              <Image src={src} alt={`Soccer player ${imgIndex + 1}`} fill className="object-cover" />
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 animate-scroll-up will-change-transform">
          {[...playerImages].reverse().map((src, imgIndex) => (
            <div
              key={`col3-${imgIndex}`}
              className="relative h-64 rounded-lg overflow-hidden"
            >
              <Image src={src} alt={`Soccer player ${imgIndex + 1}`} fill className="object-cover" />
            </div>
          ))}
          {[...playerImages].reverse().map((src, imgIndex) => (
            <div
              key={`col3-duplicate-${imgIndex}`}
              className="relative h-64 rounded-lg overflow-hidden"
            >
              <Image src={src} alt={`Soccer player ${imgIndex + 1}`} fill className="object-cover" />
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 animate-scroll-down will-change-transform">
          {[...playerImages2].reverse().map((src, imgIndex) => (
            <div
              key={`col4-${imgIndex}`}
              className="relative h-64 rounded-lg overflow-hidden"
            >
              <Image src={src} alt={`Soccer player ${imgIndex + 1}`} fill className="object-cover" />
            </div>
          ))}
          {[...playerImages2].reverse().map((src, imgIndex) => (
            <div
              key={`col4-duplicate-${imgIndex}`}
              className="relative h-64 rounded-lg overflow-hidden"
            >
              <Image src={src} alt={`Soccer player ${imgIndex + 1}`} fill className="object-cover" />
            </div>
          ))}
        </div>
      </div>

      <div className="min-h-screen w-full flex items-center justify-center relative z-10 touch-action-manipulation">
        <LoginForm />
      </div>
    </div>
  )
} 