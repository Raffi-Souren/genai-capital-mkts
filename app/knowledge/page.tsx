"use client"

import type React from "react"
import AppShell from "@/components/ui/app-shell"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, Trash2, Download } from "lucide-react"
import { EnhancedAuditPanel } from "@/components/enhanced-audit-panel"

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  uploadDate: string
}

export default function KnowledgePage() {
  const [files, setFiles] = useState<UploadedFile[]>([
    {
      id: "1",
      name: "market-analysis-q3.pdf",
      size: 2048000,
      type: "application/pdf",
      uploadDate: "2024-01-15T10:30:00Z",
    },
    {
      id: "2",
      name: "trading-guidelines.docx",
      size: 1024000,
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      uploadDate: "2024-01-14T14:20:00Z",
    },
  ])

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFileIcon = (type: string) => {
    if (type.includes("pdf")) return "📄"
    if (type.includes("word") || type.includes("document")) return "📝"
    if (type.includes("image")) return "🖼️"
    if (type.includes("json")) return "📊"
    return "📁"
  }

  const removeFile = (id: string) => {
    setFiles(files.filter((file) => file.id !== id))
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files
    if (!uploadedFiles) return

    Array.from(uploadedFiles).forEach((file) => {
      const newFile: UploadedFile = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        uploadDate: new Date().toISOString(),
      }
      setFiles((prev) => [...prev, newFile])
    })
  }

  return (
    <AppShell title="Knowledge" showFavorite={true} agentId="knowledge">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Upload className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Knowledge Base</h1>
                  <p className="text-muted-foreground">Upload and manage documents for agent knowledge base</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Document Management</Badge>
                <Badge variant="outline">{files.length} Files</Badge>
              </div>
            </div>

            {/* Upload Section */}
            <Card className="card-shadow mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload Documents
                </CardTitle>
                <CardDescription>
                  Upload up to 3 files (≤5 MB each): PDF, DOCX, PPTX, HTML, MD, TXT, JSON, PNG, JPEG, BMP, HEIC, TIFF
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-4">Drag and drop files here, or click to browse</p>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.docx,.pptx,.html,.md,.txt,.json,.png,.jpeg,.jpg,.bmp,.heic,.tiff"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload">
                    <Button variant="outline" className="bg-transparent cursor-pointer">
                      Browse Files
                    </Button>
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* File List */}
            <Card className="card-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Uploaded Documents
                  </CardTitle>
                  <Badge variant="outline">
                    {formatFileSize(files.reduce((total, file) => total + file.size, 0))} total
                  </Badge>
                </div>
                <CardDescription>Manage your uploaded documents and knowledge base</CardDescription>
              </CardHeader>
              <CardContent>
                {files.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No documents uploaded yet</p>
                    <p className="text-sm">Upload files to build your knowledge base</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {files.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{getFileIcon(file.type)}</div>
                          <div>
                            <div className="font-medium">{file.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {formatFileSize(file.size)} • Uploaded {new Date(file.uploadDate).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(file.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <EnhancedAuditPanel className="sticky top-8" maxHeight="h-96" />
          </div>
        </div>
      </div>
    </AppShell>
  )
}
