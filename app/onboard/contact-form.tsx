"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { Form, FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import UserProfileDisplay from "./components/user-profile-display";
import SocialMediaInputs from "./components/social-media-inputs";
import FormFields from "./components/form-fields";
import CustomImageUploader from "@/components/ui/image-uploader";
import { Toaster } from "@/components/ui/toaster";
import { FormSchema, FormValues } from "utils/formSchema";
import { options } from "utils/options";
import { useHedera } from "app/hederacontext"; // Hedera context

const urlPatterns: Record<string, string> = {
  x: "^https?:\\/\\/(www\\.)?twitter\\.com\\/[A-Za-z0-9_]{1,15}$",
  instagram: "^https?:\\/\\/(www\\.)?instagram\\.com\\/[A-Za-z0-9_.]+$",
  youtube: "^https?:\\/\\/(www\\.)?youtube\\.com\\/(channel\\/|user\\/)?[A-Za-z0-9_-]+$",
  tiktok: "^https?:\\/\\/(www\\.)?tiktok\\.com\\/@[A-Za-z0-9_.]+$",
  linkedin: "^https?:\\/\\/(www\\.)?linkedin\\.com\\/in\\/[A-Za-z0-9_-]+$",
};

const animatedComponents = makeAnimated();

export default function CreateProfile() {
  const [countryCode, setCountryCode] = useState<string>("");
  const { toast } = useToast();
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

  const { connectWallet, snapInstalled, isLoading, handleSnapAPIRequest } = useHedera(); // Hedera context
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: formData,
  });

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
    // Fetch user data through Hedera Snap
    const fetchUserData = async () => {
      try {
        if (!snapInstalled) {
          await connectWallet();
        }

        if (snapInstalled) {
          await handleSnapAPIRequest(); // Example interaction with Hedera Snap
          // Fetch and update form data based on the response
          // Simulate the response for form update
          setFormData({
            ...formData,
            first_name: "Hedera User",
            last_name: "Test",
            username: "hedera_user",
            email: "hedera.user@example.com",
            home_address: "Hedera Address",
            // Update other fields as necessary
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [snapInstalled]);

  const [errors, setErrors] = useState<any>({});
  const [selectedOptions, setSelectedOptions] = useState<any[]>([]);

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
      const pattern = urlPatterns[name];
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
          Authorization:
            "Bearer YOUR_PINATA_JWT_TOKEN",
        },
        body: form,
      };

      const response = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        options
      );
      const data = await response.json();
      handleChange("imageUrl", `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      // Submit form data to your server or Hedera-based backend
      console.log("Submitting form data:", data);
      setSubmitted(true);
      toast({
        title: "Profile created successfully",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error submitting form",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormFields
            formData={formData}
            handleChange={handleChange}
            errors={errors}
          />
          <SocialMediaInputs
            formData={formData}
            handleChange={handleChange}
            errors={errors}
          />
          <CustomImageUploader onImagesChange={handleImagesChange} />
          <FormItem>
            <FormLabel>Skills</FormLabel>
            <Select
              isMulti
              components={animatedComponents}
              options={options}
              value={selectedOptions}
              onChange={handleSkillChange}
              styles={customStyles}
            />
          </FormItem>
          <FormControl>
            <Button type="submit" disabled={loading || isLoading}>
              {loading || isLoading ? "Submitting..." : "Submit"}
            </Button>
          </FormControl>
        </form>
      </Form>
      <Toaster />
    </>
  );
}
