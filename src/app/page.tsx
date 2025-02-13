'use client'

import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, ChevronLeft, ChevronRight, Download, Search } from 'lucide-react'

export default function Home() {
  const [url, setUrl] = useState('')
  const [images, setImages] = useState<Array<{src: string, alt: string}>>([])
  const [currentImageIndex, setCurrentImageIndex] = useState(-1)
  const [isLoading, setIsLoading] = useState(false)

  const fetchImages = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      if (data.images && data.images.length > 0) {
        setImages(data.images)
        setCurrentImageIndex(0)
      } else {
        setImages([])
        setCurrentImageIndex(-1)
      }
    } catch (error) {
      console.error('Error fetching images:', error)
      setImages([])
      setCurrentImageIndex(-1)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePrevImage = () => {
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))
    }
  }

  const handleNextImage = () => {
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))
    }
  }

  return (
    <div className="min-h-screen bg-black text-cyan-500 p-8 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-8 text-center">Cyber Image Scraper</h1>
      <Card className="w-full max-w-md bg-gray-900 border-cyan-500 mb-8">
        <CardContent className="p-6">
          <div className="flex space-x-2 mb-4">
            <Input
              type="url"
              placeholder="Enter URL to scrape"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-grow bg-gray-800 text-cyan-500 border-cyan-500"
            />
            <Button onClick={fetchImages} disabled={isLoading} className="bg-cyan-500 text-black hover:bg-cyan-600">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
              {isLoading ? 'Scraping...' : 'Scrape'}
            </Button>
          </div>
          {images.length > 0 && currentImageIndex !== -1 && (
            <div className="relative">
              <img
                src={images[currentImageIndex].src || "/placeholder.svg"}
                alt={images[currentImageIndex].alt}
                className="w-full h-64 object-cover rounded-md border-2 border-cyan-500"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 p-2 rounded-b-md">
                <p className="text-sm text-cyan-300 truncate">{images[currentImageIndex].alt}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      {images.length > 0 && (
        <div className="flex justify-between w-full max-w-md">
          <Button onClick={handlePrevImage} className="bg-gray-800 hover:bg-gray-700">
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          <Button onClick={handleNextImage} className="bg-gray-800 hover:bg-gray-700">
            Next <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
      {images.length > 0 && (
        <Button className="mt-4 bg-cyan-500 text-black hover:bg-cyan-600">
          <Download className="mr-2 h-4 w-4" /> Save Images
        </Button>
      )}
    </div>
  )
}