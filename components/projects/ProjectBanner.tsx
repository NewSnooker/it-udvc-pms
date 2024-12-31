import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Edit, Link, Loader, PlusCircle, Type, X } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { updateProjectById } from "@/actions/projects";
import ImageInput from "@/components/FormInputs/ImageInput";
import toast from "react-hot-toast";
import { ProjectProps } from "@/types/types";
import { useForm } from "react-hook-form";
import TextInput from "@/components/FormInputs/TextInput";
import SubmitButton from "@/components/FormInputs/SubmitButton";
import { Button } from "@/components/ui/button";
import { getUnspalshImages } from "@/actions/unspalsh";
import { Input } from "../ui/input";

interface UnsplashImage {
  id: string;
  urls: {
    regular: string;
  };
  alt_description: string;
  user: {
    name: string;
  };
}
export default function ProjectBanner({
  banner,
  name,
  editingId,
  bg,
}: {
  banner: string | null;
  name: string | null;
  editingId: string;
  bg: string | null;
}) {
  const gradients = [
    "bg-gradient-to-r from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]",
    "bg-gradient-to-r from-[#4158d0] via-[#c850c0] to-[#ffcc70]",
    "bg-gradient-to-r from-[#fa8bff] via-[#2bd2ff] to-[#2bff88]",
    "bg-gradient-to-r from-[#f878ff] via-[#ffda9e] to-[#ffffff]",
    "bg-gradient-to-r from-[#ff004c] via-[#ffffff] to-[#0099ff]",
    "bg-gradient-to-r from-[#ff045c] to-[#fffdd0]",
    "bg-gradient-to-r from-[#a7d5f2] to-[#efc6ff]",
    "bg-gradient-to-r from-[#fdfcfb] to-[#e2d1c3]",
    "bg-gradient-to-r from-[#ffffff] to-[#d4dfed]",
    "bg-gradient-to-r from-[#62cff4] to-[#2c67f2]",
    "bg-gradient-to-r from-[#004ff9] to-[#000000]",
    "bg-gradient-to-r from-[#000000] to-[#444444]",
  ];
  const initialGradient = bg || gradients[0];
  const initialImage = banner || "/banner.jpg?height=250&width=1700";
  const [gradient, setGradient] = useState(initialGradient);
  const [imageUrl, setImageUrl] = useState(initialImage);
  const [loading, setLoading] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [uunsplashImages, setUnsplashImages] = useState<UnsplashImage[]>([]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectProps>({
    defaultValues: {
      bannerImage: "",
      name: name || "",
    },
  });

  // เพิ่ม state สำหรับ search query
  const [searchQuery, setSearchQuery] = useState("");
  async function handleUnsplashImage() {
    try {
      setLoading(true);
      const res = await getUnspalshImages();
      if (res?.status === 200) {
        setUnsplashImages(res.data);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }
  // เพิ่มฟังก์ชัน handleSearch
  async function handleSearch() {
    if (!searchQuery.trim()) return;
    try {
      setLoading(true);
      const res = await getUnspalshImages(searchQuery.trim());
      if (res?.status === 200) {
        setUnsplashImages(res.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }
  async function handleGradientChange(bgColor: string) {
    setGradient(bgColor);
    const data: any = { gradient: bgColor };
    try {
      if (editingId) {
        await updateProjectById(editingId, data);
      }
    } catch (error) {
      console.log(error);
    }
  }
  // click handler สำหรับรูปภาพ Unsplash
  const handleUnsplashImageSelect = async (imageUrl: string) => {
    setImageUrl(imageUrl);
    try {
      setLoading(true);
      const data: any = { bannerImage: imageUrl };
      if (editingId) {
        await updateProjectById(editingId, data);
        toast.success("อัพเดตรูปภาพแบนเนอร์สําเร็จ！");
      }
    } catch (error) {
      console.log(error);
      toast.error("เกิดข้อผิดพลาดในการอัพเดตรูปภาพ");
    } finally {
      setLoading(false);
    }
  };
  //  click handler สำหรับรูปภาพ Upload
  async function handleBannerUpdateUpload() {
    setLoading(true);
    const data: any = { bannerImage: imageUrl };
    try {
      if (editingId) {
        await updateProjectById(editingId, data);
        setLoading(false);
        toast.success("อัพเดตรูปภาพแบนเนอร์สําเร็จ！");
      }
    } catch (error) {
      console.log(error);
      toast.error("เกิดข้อผิดพลาดในการอัพเดตรูปภาพ");
    } finally {
      setLoading(false);
    }
  }

  async function updateBannerByUrlLink(data: ProjectProps) {
    try {
      setImageUrl(data.bannerImage);
      setLoading(true);
      if (editingId) {
        await updateProjectById(editingId, data);
        setLoading(false);
        toast.success("อัพเดตรูปภาพแบนเนอร์สําเร็จ!");
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }

  async function updateNameProject(data: ProjectProps) {
    try {
      setLoading(true);
      if (editingId) {
        await updateProjectById(editingId, data);
        setLoading(false);
        setIsEditingName(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }
  useEffect(() => {
    handleUnsplashImage();
  }, []);
  return (
    <div className="relative  h-60 rounded-lg overflow-hidden group">
      <Image
        src={imageUrl}
        alt="Project Banner"
        className="absolute inset-0 w-full h-full object-cover"
        height={250}
        width={1700}
      />

      <div
        className={`absolute inset-0 opacity-60 dark:opacity-75 ${gradient}`}
      />
      <div className="absolute inset-0 flex items-center justify-center flex-col sm:flex-row">
        {!isEditingName ? (
          <div className="mt-6 sm:mt-0 sm:ml-10">
            <h1 className="text-4xl font-bold text-white text-center">
              {name}
            </h1>
          </div>
        ) : (
          <form className="" onSubmit={handleSubmit(updateNameProject)}>
            <div className="flex flex-col sm:flex-row items-end gap-3">
              <TextInput
                register={register}
                errors={errors}
                label=""
                name="name"
                placeholder="กรอกชื่อโครงการ"
                icon={Type}
              />
              <SubmitButton
                title="ยืนยัน"
                loading={loading}
                loadingTitle="กำลังอัพเดต..."
                className="w-full sm:w-auto"
              />
            </div>
          </form>
        )}

        <Button
          variant={"ghost"}
          size={"icon"}
          onClick={() => setIsEditingName(!isEditingName)}
          className={`${
            isEditingName ? "ml-2 mt-2" : ""
          } hover:bg-transparent text-white hover:text-white opacity-0 group-hover:opacity-100 transition-opacity `}
        >
          {!isEditingName ? (
            <Edit className="h-4 w-4" />
          ) : (
            <X className="h-4 w-4 " />
          )}
        </Button>

        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size={"icon"}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity  "
            >
              <Edit className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className=" mb-2">แก้ไขแบนเนอร์</DialogTitle>
              <Tabs defaultValue="gradient" className="w-full">
                <TabsList className="w-full ">
                  <TabsTrigger className="w-full" value="gradient">
                    <p className="hidden lg:block">ไล่ระดับ</p>สี
                  </TabsTrigger>
                  <TabsTrigger className="w-full" value="upload">
                    อัพโหลด
                  </TabsTrigger>
                  <TabsTrigger className="w-full" value="link">
                    URL
                  </TabsTrigger>
                  <TabsTrigger className="w-full" value="unspalsh">
                    unspalsh
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="gradient" className="w-full">
                  <div className="grid grid-cols-2 lg:grid-cols-4 px-4 mt-4 justify-center items-center gap-x-10 sm:gap-x-8 gap-y-4 w-full">
                    {gradients.map((item, index) => (
                      <div
                        key={index}
                        onClick={() => handleGradientChange(item)}
                        className={`${cn(
                          "h-16 rounded-2xl shadow-lg cursor-pointer hover:scale-95 transition-all"
                        )} ${item}
                        ${gradient === item ? "border-2 border-red-600 " : ""}`}
                      />
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="upload">
                  <div className="grid auto-rows-max items-start gap-4">
                    <ImageInput
                      title="รูปภาพแบนเนอร์"
                      imageUrl={imageUrl}
                      setImageUrl={setImageUrl}
                      endpoint="bannerImage"
                    />
                  </div>
                  <div
                    className={`py-3 px-6 mt-2 cursor-pointer text-center bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg text-sm font-normal transition-colors ${
                      loading ? "opacity-50 cursor-none" : "opacity-100"
                    }`}
                    onClick={handleBannerUpdateUpload}
                  >
                    <div>
                      {loading ? (
                        <div className=" flex items-center justify-center gap-1">
                          <Loader className="w-4 h-4 animate-spin" />
                          <span>กำลังอัพเดต...</span>
                        </div>
                      ) : (
                        <div className=" flex items-center justify-center gap-1">
                          <PlusCircle className="w-4 h-4" />
                          <span>ยืนยันการอัพเดต</span>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="link">
                  <form
                    className=""
                    onSubmit={handleSubmit(updateBannerByUrlLink)}
                  >
                    <div className="grid gap-3">
                      <TextInput
                        register={register}
                        errors={errors}
                        label="ลิงค์"
                        name="bannerImage"
                        placeholder="https://example.com"
                        icon={Link}
                      />
                      <SubmitButton
                        title="ยืนยันการอัพเดต"
                        loading={loading}
                        loadingTitle="กำลังอัพเดต..."
                      />
                    </div>
                  </form>
                </TabsContent>
                <TabsContent value="unspalsh">
                  <div className="space-y-4">
                    {/* Search Input */}
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Input
                          type="text"
                          placeholder="ค้นหารูปภาพ..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleSearch();
                            }
                          }}
                        />
                        {searchQuery && (
                          <button
                            onClick={() => {
                              setSearchQuery("");
                              handleUnsplashImage();
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      <Button
                        onClick={handleSearch}
                        disabled={loading}
                        className="flex items-center gap-2"
                      >
                        {loading ? (
                          <Loader className="h-4 w-4 animate-spin" />
                        ) : (
                          "ค้นหา"
                        )}
                      </Button>
                    </div>

                    {/* Image Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      {loading ? (
                        <div className="col-span-2 flex justify-center items-center py-8">
                          <Loader className="w-6 h-6 animate-spin" />
                        </div>
                      ) : uunsplashImages.length === 0 ? (
                        <div className="col-span-2 text-center py-8 text-gray-500">
                          ไม่พบรูปภาพที่ค้นหา
                        </div>
                      ) : (
                        uunsplashImages.map((image) => (
                          <div
                            key={image.id}
                            className="relative h-32 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() =>
                              handleUnsplashImageSelect(image.urls.regular)
                            }
                          >
                            <Image
                              src={image.urls.regular}
                              alt={image.alt_description || "Unsplash image"}
                              className="object-cover"
                              fill
                              sizes="(max-width: 768px) 50vw, 33vw"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2">
                              <p className="text-white text-xs truncate">
                                Photo by {image.user.name}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
