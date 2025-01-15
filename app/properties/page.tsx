'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import Link from 'next/link'
import Image from 'next/image'
import { properties, Property } from '@/lib/properties-data'
import { Search, LayoutGrid, List } from 'lucide-react'

type Filters = {
  priceRange: [number, number]
  roiRange: [number, number]
  propertyType: string
  sortBy: string
}

export default function PropertiesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<Filters>({
    priceRange: [0, 1000000],
    roiRange: [0, 10],
    propertyType: 'all',
    sortBy: 'price-low'
  })
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Filter properties based on all criteria
  const filteredProperties = properties.filter((property: Property) => {
    // Search query filter
    const matchesSearch = searchQuery === '' || 
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase())
    
    // Price range filter
    const matchesPrice = 
      property.price >= filters.priceRange[0] && 
      property.price <= filters.priceRange[1]
    
    // ROI range filter
    const matchesRoi = 
      property.roi >= filters.roiRange[0] && 
      property.roi <= filters.roiRange[1]
    
    // Property type filter
    const matchesType = 
      filters.propertyType === 'all' || 
      property.type === filters.propertyType

    return matchesSearch && matchesPrice && matchesRoi && matchesType
  })

  // Sort properties
  const sortedProperties = [...filteredProperties].sort((a: Property, b: Property) => {
    switch (filters.sortBy) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'roi-high':
        return b.roi - a.roi
      default:
        return 0
    }
  })

  // Reset filters function
  const resetFilters = () => {
    setFilters({
      priceRange: [0, 1000000],
      roiRange: [0, 10],
      propertyType: 'all',
      sortBy: 'price-low'
    })
    setSearchQuery('')
  }

  return (
    <div className="min-h-screen bg-[#0B1120] text-gray-100">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col space-y-8">
          {/* Header Section */}
          <div className="border-b border-gray-800 pb-6">
            <h1 className="text-3xl font-bold text-white">Available Properties</h1>
            <p className="mt-2 text-gray-400">Find your next investment opportunity</p>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Panel */}
            <div className="lg:w-[300px] space-y-6">
              <div className="bg-gray-800/50 rounded-lg p-6 space-y-6">
                {/* Search Bar */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      type="text"
                      placeholder="Search by title or location..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 bg-gray-700/50 border-gray-600 text-white w-full"
                    />
                  </div>
                </div>

                {/* Price Range */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Price Range</label>
                  <div className="space-y-2">
                    <Input
                      type="number"
                      placeholder="Min Price"
                      value={filters.priceRange[0] || ''}
                      onChange={(e) => setFilters({
                        ...filters,
                        priceRange: [
                          e.target.value === '' ? 0 : Number(e.target.value),
                          filters.priceRange[1]
                        ]
                      })}
                      className="bg-gray-700/50 border-gray-600"
                      min={0}
                      step="1000"
                    />
                    <Input
                      type="number"
                      placeholder="Max Price"
                      value={filters.priceRange[1] || ''}
                      onChange={(e) => setFilters({
                        ...filters,
                        priceRange: [
                          filters.priceRange[0],
                          e.target.value === '' ? 1000000 : Number(e.target.value)
                        ]
                      })}
                      className="bg-gray-700/50 border-gray-600"
                      min={0}
                      step="1000"
                    />
                  </div>
                </div>

                {/* ROI Range */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">ROI Range (%)</label>
                  <div className="space-y-2">
                    <Input
                      type="number"
                      placeholder="Min ROI"
                      value={filters.roiRange[0]}
                      onChange={(e) => setFilters({
                        ...filters,
                        roiRange: [Number(e.target.value), filters.roiRange[1]]
                      })}
                      className="bg-gray-700/50 border-gray-600"
                    />
                    <Input
                      type="number"
                      placeholder="Max ROI"
                      value={filters.roiRange[1]}
                      onChange={(e) => setFilters({
                        ...filters,
                        roiRange: [filters.roiRange[0], Number(e.target.value)]
                      })}
                      className="bg-gray-700/50 border-gray-600"
                    />
                  </div>
                </div>

                {/* Property Type */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Property Type</label>
                  <Select
                    value={filters.propertyType}
                    onValueChange={(value) => setFilters({ ...filters, propertyType: value })}
                  >
                    <SelectTrigger className="bg-gray-700/50 border-gray-600">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="villa">Villa</SelectItem>
                      <SelectItem value="office">Office</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort By */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Sort By</label>
                  <Select
                    value={filters.sortBy}
                    onValueChange={(value) => setFilters({ ...filters, sortBy: value })}
                  >
                    <SelectTrigger className="bg-gray-700/50 border-gray-600">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="roi-high">Highest ROI</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Reset Filters */}
                <Button 
                  variant="outline" 
                  className="w-full bg-transparent border-gray-600 text-gray-400 hover:text-white hover:border-gray-500"
                  onClick={resetFilters}
                >
                  Reset Filters
                </Button>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Results count */}
              <p className="text-sm text-gray-400 mb-6">
                Showing {sortedProperties.length} of {properties.length} properties
              </p>

              {/* Property Grid */}
              <div className="flex justify-end mb-4">
                <div className="bg-gray-800/50 rounded-lg p-1">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className={viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                : "flex flex-col space-y-6"
              }>
                {sortedProperties.map((property) => (
                  <Card 
                    key={property.id} 
                    className={`overflow-hidden bg-gray-800/50 border-gray-700 hover:border-gray-600 transition-colors ${
                      viewMode === 'grid' 
                        ? 'h-[420px] flex flex-col'
                        : 'flex flex-row h-[180px]'
                    }`}
                  >
                    <div className={`relative ${viewMode === 'grid' ? 'h-48 w-full' : 'w-[280px]'}`}>
                      <Image
                        src={property.image}
                        alt={property.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-3 right-3 bg-white/10 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium">
                        {property.type}
                      </div>
                    </div>

                    <CardContent className={`${
                      viewMode === 'grid' 
                        ? 'p-4 flex flex-col flex-1'
                        : 'flex-1 p-6 flex flex-col justify-between'
                    }`}>
                      <div>
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <h3 className="text-lg font-semibold text-white line-clamp-1">
                              {property.title}
                            </h3>
                            <p className="text-sm text-gray-400 mt-1">
                              {property.location}
                            </p>
                          </div>
                          {viewMode === 'list' && (
                            <div className="text-right shrink-0 flex gap-3">
                              <div className="bg-white/5 p-2 rounded">
                                <p className="text-xs text-gray-400">Price</p>
                                <p className="text-sm font-semibold text-[#3B82F6]">
                                  ${property.price.toLocaleString()}
                                </p>
                              </div>
                              <div className="bg-white/5 p-2 rounded">
                                <p className="text-xs text-gray-400">Expected ROI</p>
                                <p className="text-sm font-semibold text-[#10B981]">
                                  {property.roi}%
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        {viewMode === 'grid' && (
                          <div className="mt-4 grid grid-cols-2 gap-2">
                            <div className="bg-white/5 p-2 rounded">
                              <p className="text-xs text-gray-400">Price</p>
                              <p className="text-sm font-semibold text-[#3B82F6]">
                                ${property.price.toLocaleString()}
                              </p>
                            </div>
                            <div className="bg-white/5 p-2 rounded">
                              <p className="text-xs text-gray-400">Expected ROI</p>
                              <p className="text-sm font-semibold text-[#10B981]">
                                {property.roi}%
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {viewMode === 'list' ? (
                        <div className="flex items-center mt-4">
                          <Link href={`/property/${property.id}`}>
                            <Button className="bg-[#3B82F6] hover:bg-[#2563EB] text-white px-6">
                              View Details
                            </Button>
                          </Link>
                        </div>
                      ) : (
                        <Link href={`/property/${property.id}`} className="mt-4 block">
                          <Button className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white">
                            View Details
                          </Button>
                        </Link>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {sortedProperties.length === 0 && (
                <div className="text-center py-12 bg-gray-800/50 rounded-lg">
                  <p className="text-gray-400">No properties found matching your criteria.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
