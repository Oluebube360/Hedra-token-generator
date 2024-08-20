"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  getUserByAddress,
  getUsernameByAddress,
  editUser,
} from "utils/queries";

import FormFields from "app/onboard/components/form-fields";
import SocialMediaInputs from "app/onboard/components/social-media-inputs";
import UserProfileDisplay from "app/onboard/components/user-profile-display";
import CustomImageUploader from "@/components/ui/image-uploader";

import { Toaster } from "@/components/ui/toaster";
import { FormSchema, FormValues } from "utils/formSchema";
import { options } from "utils/options";
import Select from "react-select";
import makeAnimated from "react-select/animated";

const animatedComponents = makeAnimated();

const snapId = `npm:@hashgraph/hedera-wallet-snap`;

export default function EditProfile() {
  const [countryCode, setCountryCode] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormValues>({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    home_address: "",
    date_of_birth: "",
    education: "",
    work_history: "",
    phone_number: "",
    job_title: "",
    x: "",
    instagram: "",
    tiktok: "",
    youtube: "",
    linkedin: "",
    info: "",
    imageUrl: "",
    skills: ["UI/UX", "DevOps", "FrontEnd Dev"],
  });

  const { toast } = useToast();

  useEffect(() => {
    const fetchCountryCode = async () => {
      try {
        const response = await axios.get("https://ipapi.co/json/");
        setCountryCode(response.data.country_code);
        handleChange("country_code", response.data.country_code);
      } catch (error) {
        console.error("Error fetching country code:", error);
      }
    };
    fetchCountryCode();
  }, []);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        // Get user's address from Hedera Snap (replace with actual method)
        const address = await getWalletAddress();
        let userInfo = await getUserByAddress(address);
        let username = await getUsernameByAddress(address);
        setFormData({
          first_name: userInfo.basicInfo.firstName,
          last_name: userInfo.basicInfo.lastName,
          username: username,
          email: userInfo.basicInfo.email,
          home_address: userInfo.basicInfo.homeAddress,
          date_of_birth: userInfo.basicInfo.dateOfBirth,
          education: userInfo.professionalInfo.education,
          work_history: userInfo.professionalInfo.workHistory,
          phone_number: userInfo.basicInfo.phoneNumber,
          job_title: userInfo.professionalInfo.jobTitle,
          x: userInfo.socialLinks.x,
          instagram: userInfo.socialLinks.instagram,
          tiktok: userInfo.socialLinks.tiktok,
          youtube: userInfo.socialLinks.youtube,
          linkedin: userInfo.socialLinks.linkedin,
          info: userInfo.professionalInfo.info,
          skills: userInfo.professionalInfo.skills,
          imageUrl: userInfo.professionalInfo.imageURL,
        });
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };
    getUserInfo();
  }, []);

  const [errors, setErrors] = useState<any>({});
  const [selectedOptions, setSelectedOptions] = useState<any[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: formData,
  });

  const validateUrl = (url: string, pattern: string) => {
    if (!url) return false;
    const regex = new RegExp(pattern);
    return regex.test(url);
  };

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    let error = "";
    if (name === "email" && value && !/.+@.+\..+/.test(value)) {
      error = "Invalid email address";
    } else if (
      ["x", "instagram", "youtube", "tiktok", "linkedin"].includes(name)
    ) {
      const pattern = {
        x: "^https?:\\/\\/(www\\.)?twitter\\.com\\/[A-Za-z0-9_]{1,15}$",
        instagram: "^https?:\\/\\/(www\\.)?instagram\\.com\\/[A-Za-z0-9_.]+$",
        youtube:
          "^https?:\\/\\/(www\\.)?youtube\\.com\\/(channel\\/|user\\/)?[A-Za-z0-9_-]+$",
        tiktok: "^https?:\\/\\/(www\\.)?tiktok\\.com\\/@[A-Za-z0-9_.]+$",
        linkedin:
          "^https?:\\/\\/(www\\.)?linkedin\\.com\\/in\\/[A-Za-z0-9_-]+$",
      }[name];

      if (pattern) {
        const isValid = validateUrl(value, pattern);
        if (!isValid) {
          error = `Invalid ${name.charAt(0).toUpperCase() + name.slice(1)} URL`;
        }
      }
    }
    setErrors((prevErrors: any) => ({ ...prevErrors, [name]: error }));
  };

  const handleSkillChange = (selected: any) => {
    if (selected.length <= 3) {
      const selectedValues = selected.map((option: any) => option.value);
      setSelectedOptions(selected);
      handleChange("skills", selectedValues);
    }
  };

  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      borderColor: state.isFocused ? "#000000" : "#d1d5db",
      boxShadow: state.isFocused ? "0 0 0 1px #d1d5db" : "none",
      "&:hover": {
        borderColor: "#d1d5db",
      },
      borderRadius: "0.375rem",
      paddingTop: "0.2rem",
      paddingBottom: "0.2rem",
    }),
    multiValue: (provided: any) => ({
      ...provided,
      backgroundColor: "#e5e7eb",
    }),
    multiValueLabel: (provided: any) => ({
      ...provided,
      color: "#374151",
    }),
    multiValueRemove: (provided: any) => ({
      ...provided,
      color: "#6b7280",
      "&:hover": {
        color: "#4b5563",
      },
    }),
  };

  const handleImagesChange = async (files: File[]) => {
    const file = files[0];
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("pinataMetadata", JSON.stringify({ name: file.name }));
      form.append("pinataOptions", JSON.stringify({ cidVersion: 1 }));

      const options = {
        method: "POST",
        headers: {
          Authorization: "Bearer <YOUR_PINATA_JWT>",
        },
        body: form,
      };

      const response = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        options
      );

      const responseData = await response.json();
      if (responseData.error) {
        throw new Error(responseData.error);
      }
      const fileUrl = `https://gateway.pinata.cloud/ipfs/${responseData.IpfsHash}`;
      setFormData((prev) => ({ ...prev, imageUrl: fileUrl }));
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const basicInfo = {
        firstName: formData.first_name,
        lastName: formData.last_name,
        email: formData.email,
        homeAddress: formData.home_address,
        dateOfBirth: formData.date_of_birth,
        phoneNumber: formData.phone_number,
      };

      const professionalInfo = {
        jobTitle: formData.job_title,
        education: formData.education,
        workHistory: formData.work_history,
        info: formData.info,
        skills: formData.skills,
        imageURL: formData.imageUrl,
      };

      const socialLinks = {
        x: formData.x,
        instagram: formData.instagram,
        tiktok: formData.tiktok,
        youtube: formData.youtube,
        linkedin: formData.linkedin,
      };

      const userInfo = {
        basicInfo,
        professionalInfo,
        socialLinks,
      };

      const address = await getWalletAddress(); // Fetch wallet address from Hedera Snap

      await editUser(address, userInfo);

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      setSubmitted(true);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "There was an error updating your profile.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <Toaster />
      <Form>
        <form onSubmit={onSubmit}>
          <FormFields
            form={form}
            handleChange={handleChange}
            errors={errors}
          />
          <SocialMediaInputs
            form={form}
            handleChange={handleChange}
            errors={errors}
          />
          <CustomImageUploader handleChange={handleImagesChange} />
          <div className="flex items-center justify-between">
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Profile"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

async function getWalletAddress() {
  // Placeholder function to get wallet address from Hedera Snap
  // Replace with actual implementation
  return "0xYourWalletAddress";
}
