import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Edit, Link, Loader, PlusCircle } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { updateProjectById } from "@/actions/projects";
import ImageInput from "@/components/FormInputs/ImageInput";
import toast from "react-hot-toast";
import { ProjectProps } from "@/types/types";
import { useForm } from "react-hook-form";
import TextInput from "@/components/FormInputs/TextInput";
import SubmitButton from "@/components/FormInputs/SubmitButton";
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
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectProps>({
    defaultValues: {
      bannerImage: "",
    },
  });
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
  async function handleBannerUpdate() {
    setLoading(true);
    const data: any = { bannerImage: imageUrl };
    try {
      if (editingId) {
        await updateProjectById(editingId, data);
        setLoading(false);
        toast.success("อัพเดตรูปภาพแบนเนอร์สําเร็จ！");
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }

  async function updateBannerByUrl(data: ProjectProps) {
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
  return (
    <div className="relative h-56 rounded-lg overflow-hidden">
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
      <div className="absolute inset-0 flex items-center justify-center">
        <h1 className="text-4xl font-bold text-white">{name}</h1>

        <Dialog>
          <DialogTrigger asChild>
            <div className=" absolute top-2 right-2 p-3 cursor-pointer rounded-lg hover:bg-accent hover:text-accent-foreground text-sm font-semibold transition-colors ">
              <Edit className="h-4 w-4" />
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className=" mb-2">แก้ไขแบนเนอร์</DialogTitle>
              <Tabs defaultValue="ไล่ระดับสี" className="w-full">
                <TabsList className="w-full ">
                  <TabsTrigger className="w-full" value="gradient">
                    ไล่ระดับสี
                  </TabsTrigger>
                  <TabsTrigger className="w-full" value="upload">
                    อัพโหลด
                  </TabsTrigger>
                  <TabsTrigger className="w-full" value="link">
                    รูปภาพ URL
                  </TabsTrigger>
                  <TabsTrigger className="w-full" value="unspalsh">
                    unspalsh
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="gradient">
                  <div className="grid grid-cols-2 lg:grid-cols-4 py-4 px-6 gap-4">
                    {gradients.map((item, index) => (
                      <div
                        key={index}
                        onClick={() => handleGradientChange(item)}
                        className={`${cn(
                          "h-16 w-20 rounded-2xl shadow-lg cursor-pointer hover:scale-95 transition-all"
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
                    onClick={handleBannerUpdate}
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
                  <form className="" onSubmit={handleSubmit(updateBannerByUrl)}>
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
                  <div className="grid grid-cols-2 lg:grid-cols-4 py-4 px-6 gap-4">
                    {gradients.map((item, index) => (
                      <div
                        key={index}
                        onClick={() => handleGradientChange(item)}
                        className={`${cn(
                          "h-16 w-20 rounded-2xl shadow-lg cursor-pointer hover:scale-95 transition-all"
                        )} ${item}
                        ${gradient === item ? "border-2 border-red-600 " : ""}`}
                      />
                    ))}
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
