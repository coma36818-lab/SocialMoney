'use client';
import React, { useState } from "react";
import { base44 } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, User, MapPin, Heart, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { createPageUrl } from "@/lib/utils";
import type { User as UserType } from "@/lib/types";

export default function Cerca() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    gender: "all",
    city: "",
    region: ""
  });

  const { data: allUsers = [], isLoading } = useQuery({
    queryKey: ['allUsers'],
    queryFn: () => base44.entities.User.list(),
  });

  const filteredUsers = allUsers.filter((user: UserType) => {
    if (!user) return false;

    const matchesSearch = 
      user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.region?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesGender = filters.gender === "all" || user.gender === filters.gender;
    const matchesCity = !filters.city || user.city?.toLowerCase().includes(filters.city.toLowerCase());
    const matchesRegion = !filters.region || user.region?.toLowerCase().includes(filters.region.toLowerCase());

    return matchesSearch && matchesGender && matchesCity && matchesRegion;
  });

  const getGenderLabel = (gender: UserType['gender']) => {
    const labels = {
      uomo: "Uomo",
      donna: "Donna",
      altro: "Altro",
      'non specificato': "Non specificato"
    };
    return labels[gender] || gender;
  };

  return (
    <div className="min-h-screen bg-[#111111]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            <span className="text-[#FF0055]">Cerca</span> Utenti
          </h1>
          <p className="text-gray-400">Trova persone su Social Money</p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-card border-white/5 mb-6">
            <CardContent className="p-6 space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cerca per nome, email, città..."
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                />
              </div>

              {/* Filters */}
              <div className="grid md:grid-cols-3 gap-4">
                <Select
                  value={filters.gender}
                  onValueChange={(value) => setFilters({ ...filters, gender: value })}
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Genere" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a1a] border-white/10">
                    <SelectItem value="all" className="text-white">Tutti</SelectItem>
                    <SelectItem value="uomo" className="text-white">Uomo</SelectItem>
                    <SelectItem value="donna" className="text-white">Donna</SelectItem>
                    <SelectItem value="altro" className="text-white">Altro</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  value={filters.city}
                  onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                  placeholder="Città"
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                />

                <Input
                  value={filters.region}
                  onChange={(e) => setFilters({ ...filters, region: e.target.value })}
                  placeholder="Regione"
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results */}
        <div className="space-y-4">
          {isLoading ? (
             <div className="min-h-screen w-full flex items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <Card className="glass-card border-white/5">
              <CardContent className="p-12 text-center">
                <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Nessun risultato</h3>
                <p className="text-gray-400">Prova a modificare i filtri di ricerca</p>
              </CardContent>
            </Card>
          ) : (
            filteredUsers.map((user: UserType, index: number) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="glass-card border-white/5 hover:border-white/10 transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div 
                        className="flex items-center gap-4 flex-1"
                      >
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="w-16 h-16 bg-gradient-to-br from-[#FF0055] to-[#ff3366] rounded-full flex items-center justify-center"
                        >
                          <User className="w-8 h-8 text-white" />
                        </motion.div>
                        <div className="flex-1">
                          <h3 className="font-bold text-white text-lg">{user.full_name}</h3>
                          <p className="text-sm text-gray-400">@{user.email.split('@')[0]}</p>
                          
                          <div className="flex flex-wrap gap-3 mt-2">
                            {user.gender && (
                              <span className="text-xs text-gray-400">
                                {getGenderLabel(user.gender)}
                              </span>
                            )}
                            {(user.city || user.region) && (
                              <span className="text-xs text-gray-400 flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {[user.city, user.region].filter(Boolean).join(', ')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          onClick={() => router.push(createPageUrl("profilo"))}
                          className="bg-gradient-to-r from-[#FF0055] to-[#ff3366] hover:opacity-90 text-white"
                        >
                          Vedi Profilo
                        </Button>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
