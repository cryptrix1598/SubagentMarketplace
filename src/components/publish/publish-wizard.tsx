"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CATEGORIES, LICENSES } from "@/lib/constants";
import { agentPublishSchema } from "@/lib/validations";
import { publishAgent } from "@/actions/agent";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Loader2,
  Upload,
  X,
} from "lucide-react";

type Step = "details" | "content" | "settings" | "review";

const STEPS: { key: Step; label: string }[] = [
  { key: "details", label: "Details" },
  { key: "content", label: "Content" },
  { key: "settings", label: "Settings" },
  { key: "review", label: "Review & Publish" },
];

export function PublishWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>("details");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tagInput, setTagInput] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    readme: "",
    category: "",
    tags: [] as string[],
    license: "MIT",
    repository: "",
    homepage: "",
    version: "1.0.0",
    isPrivate: false,
  });

  const currentStepIndex = STEPS.findIndex((s) => s.key === currentStep);

  const updateField = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !formData.tags.includes(tag) && formData.tags.length < 10) {
      updateField("tags", [...formData.tags, tag]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    updateField(
      "tags",
      formData.tags.filter((t) => t !== tag),
    );
  };

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === "details") {
      if (!formData.name.trim()) newErrors["name"] = "Name is required";
      if (!formData.description.trim())
        newErrors["description"] = "Description is required";
      if (!formData.category) newErrors["category"] = "Category is required";
    }

    if (currentStep === "content") {
      if (!formData.readme.trim())
        newErrors["readme"] = "README content is required";
    }

    if (currentStep === "settings") {
      if (formData.repository && !formData.repository.startsWith("http")) {
        newErrors["repository"] = "Must be a valid URL";
      }
      if (formData.homepage && !formData.homepage.startsWith("http")) {
        newErrors["homepage"] = "Must be a valid URL";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < STEPS.length) {
      setCurrentStep(STEPS[nextIndex]!.key);
    }
  };

  const handlePrev = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(STEPS[prevIndex]!.key);
    }
  };

  const handlePublish = async () => {
    setIsSubmitting(true);
    try {
      const result = await publishAgent({
        name: formData.name,
        slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, "-"),
        description: formData.description,
        readme: formData.readme,
        category: formData.category,
        tags: formData.tags,
        license: formData.license,
        repository: formData.repository || undefined,
        homepage: formData.homepage || undefined,
        version: formData.version,
      });

      if (result.data) {
        router.push(`/explore`);
      } else {
        setErrors({ ["submit"]: result.error || "Failed to publish agent" });
      }
    } catch {
      setErrors({ ["submit"]: "An unexpected error occurred" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      {/* Step indicator */}
      <div className="mb-8 flex items-center justify-between">
        {STEPS.map((step, index) => (
          <div key={step.key} className="flex items-center">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                index < currentStepIndex
                  ? "bg-primary text-primary-foreground"
                  : index === currentStepIndex
                  ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {index < currentStepIndex ? (
                <Check className="h-4 w-4" />
              ) : (
                index + 1
              )}
            </div>
            <span
              className={`ml-2 hidden text-sm sm:inline ${
                index <= currentStepIndex
                  ? "font-medium text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {step.label}
            </span>
            {index < STEPS.length - 1 && (
              <div
                className={`mx-4 h-0.5 w-8 sm:w-16 ${
                  index < currentStepIndex ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {currentStep === "details" && (
            <Card>
              <CardHeader>
                <CardTitle>Agent Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => {
                      updateField("name", e.target.value);
                      if (!formData.slug || formData.slug === formData.name.toLowerCase().replace(/\s+/g, "-")) {
                        updateField("slug", e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
                      }
                    }}
                    placeholder="My Awesome Agent"
                  />
                  {errors["name"] && (
                    <p className="text-sm text-destructive">{errors["name"]}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">URL Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) =>
                      updateField(
                        "slug",
                        e.target.value
                          .toLowerCase()
                          .replace(/\s+/g, "-")
                          .replace(/[^a-z0-9-]/g, ""),
                      )
                    }
                    placeholder="my-awesome-agent"
                  />
                  <p className="text-xs text-muted-foreground">
                    Will be available at /@username/{formData.slug || "slug"}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    placeholder="A brief description of your agent..."
                    rows={3}
                  />
                  {errors["description"] && (
                    <p className="text-sm text-destructive">
                      {errors["description"]}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(v) => updateField("category", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors["category"] && (
                    <p className="text-sm text-destructive">
                      {errors["category"]}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                      placeholder="Add a tag..."
                    />
                    <Button type="button" variant="outline" onClick={addTag}>
                      Add
                    </Button>
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {formData.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="gap-1 cursor-pointer"
                          onClick={() => removeTag(tag)}
                        >
                          {tag}
                          <X className="h-3 w-3" />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === "content" && (
            <Card>
              <CardHeader>
                <CardTitle>Agent Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="readme">README *</Label>
                  <Textarea
                    id="readme"
                    value={formData.readme}
                    onChange={(e) => updateField("readme", e.target.value)}
                    placeholder="# My Agent&#10;&#10;## Description&#10;What this agent does...&#10;&#10;## Usage&#10;How to use this agent..."
                    rows={15}
                    className="font-mono text-sm"
                  />
                  {errors["readme"] && (
                    <p className="text-sm text-destructive">{errors["readme"]}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Markdown is supported. Include usage instructions, configuration options, and examples.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === "settings" && (
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="version">Initial Version</Label>
                  <Input
                    id="version"
                    value={formData.version}
                    onChange={(e) => updateField("version", e.target.value)}
                    placeholder="1.0.0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="license">License</Label>
                  <Select
                    value={formData.license}
                    onValueChange={(v) => updateField("license", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LICENSES.map((lic) => (
                        <SelectItem key={lic.value} value={lic.value}>
                          {lic.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="repository">Repository URL</Label>
                  <Input
                    id="repository"
                    value={formData.repository}
                    onChange={(e) => updateField("repository", e.target.value)}
                    placeholder="https://github.com/user/repo"
                  />
                  {errors["repository"] && (
                    <p className="text-sm text-destructive">
                      {errors["repository"]}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="homepage">Homepage URL</Label>
                  <Input
                    id="homepage"
                    value={formData.homepage}
                    onChange={(e) => updateField("homepage", e.target.value)}
                    placeholder="https://my-agent.dev"
                  />
                  {errors["homepage"] && (
                    <p className="text-sm text-destructive">
                      {errors["homepage"]}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === "review" && (
            <Card>
              <CardHeader>
                <CardTitle>Review & Publish</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Name</span>
                    <span className="font-medium">{formData.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Slug</span>
                    <span className="font-mono text-sm">{formData.slug}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Category</span>
                    <Badge variant="secondary">{formData.category}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Version</span>
                    <span className="font-mono text-sm">{formData.version}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">License</span>
                    <span className="text-sm">{formData.license}</span>
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Tags</span>
                      <div className="flex gap-1">
                        {formData.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {formData.repository && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Repository</span>
                      <a
                        href={formData.repository}
                        className="text-sm text-primary hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {formData.repository}
                      </a>
                    </div>
                  )}
                </div>

                <div className="rounded-lg border p-4">
                  <span className="text-sm text-muted-foreground">Description</span>
                  <p className="mt-1 text-sm">{formData.description}</p>
                </div>

                {errors["submit"] && (
                  <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                    {errors["submit"]}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="mt-6 flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={currentStepIndex === 0}
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Previous
        </Button>

        {currentStep === "review" ? (
          <Button
            onClick={handlePublish}
            disabled={isSubmitting}
            className="min-w-[140px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Publish Agent
              </>
            )}
          </Button>
        ) : (
          <Button onClick={handleNext}>
            Next
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}