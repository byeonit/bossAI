import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { SupabaseService } from "../../services/supabase.service";
import { ProductDescription, Product, ImageGenerationOptions, GeneratedImage } from "../../types/supabase.types";
import {
  SocialPromoOptions,
  SocialPromoContent,
} from "../../types/supabase.types";
import Swal from "sweetalert2";
import { ProductSelectorComponent } from "../../components/product-seo/product-selector/product-selector.component";
import { DescriptionGeneratorComponent } from "../../components/product-seo/description-generator/description-generator.component";
import { SocialContentGeneratorComponent } from "../../components/product-seo/social-content-generator/social-content-generator.component";
import { ImageGeneratorComponent } from "../../components/product-seo/image-generator/image-generator.component";

@Component({
  selector: "app-product-seo",
  standalone: true,
  imports: [
    CommonModule, 
    ProductSelectorComponent,
    DescriptionGeneratorComponent,
    SocialContentGeneratorComponent,
    ImageGeneratorComponent
    ],
  templateUrl: "./product-seo.component.html",
})
export class ProductSeoComponent implements OnInit {
  // Product-related properties
  products: Product[] = [];
  productDescriptions: ProductDescription[] = [];
  selectedProduct: Product | null = null;
  product = {
    name: "",
    details: "",
    tone: "professional",
  };

  // UI state properties
  isLoading = false;
  error: string | null = null;
  submitted = false;

  // Social content properties
  socialOptions: SocialPromoOptions = {
    platform: 'instagram',
    contentType: 'product_showcase',
    tone: 'professional',
    includePrice: false,
    includeCTA: true,
    targetAudience: 'general',
    promotionalAngle: 'features'
  };
  isGeneratingSocial = false;
  generatedSocialContent: SocialPromoContent | null = null;
  savedSocialContent: SocialPromoContent[] = [];
  generatedContent: SocialPromoContent[] = [];
  activePlatform: 'instagram' | 'pinterest' | 'facebook' = 'instagram';

  // Image generation properties
  imageOptions: ImageGenerationOptions = {
    platform: 'instagram',
    style: 'realistic',
    mood: 'bright',
    composition: 'product_only',
    background: 'plain',
    colorScheme: 'brand_colors',
    includeText: false,
    includeLogo: false,
    aspectRatio: '1:1'
  };
  platforms: ('instagram' | 'pinterest' | 'facebook')[] = [
    'instagram',
    'pinterest',
    'facebook'
  ];
  aspectRatios: ('1:1' | '4:5' | '16:9' | '9:16')[] = ['1:1', '4:5', '16:9', '9:16'];
  isGeneratingImage = false;
  generatedImage: GeneratedImage | null = null;
  savedImages: GeneratedImage[] = [];

  constructor(private supabaseService: SupabaseService) {}

  ngOnInit() {
    this.loadProducts();
    this.loadProductDescriptions();
  }

  loadProducts() {
    this.supabaseService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
      },
      error: (error) => {
        console.error("Error loading products:", error);
        this.error = "Failed to load products";
      },
    });
  }

  loadProductDescriptions() {
    this.supabaseService.getProductDescriptions().subscribe({
      next: (descriptions) => {
        this.productDescriptions = descriptions;
      },
      error: (error) => {
        console.error("Error loading product descriptions:", error);
        this.error = "Failed to load product descriptions";
      },
    });
  }

  selectProduct(product: Product) {
    this.selectedProduct = product;
    this.product = {
      name: product.name,
      details: product.description,
      tone: "professional",
    };
  }

  clearForm() {
    this.selectedProduct = null;
    this.product = {
      name: "",
      details: "",
      tone: "professional",
    };
  }
/*
  generateDescription() {
    this.submitted = true;

    if (!this.product.name || !this.product.details) {
      return;
    }

    this.isLoading = true;

    // For now, we'll use a dummy generated description
    const dummyDescription = `Introducing the ${
      this.product.name
    } - a revolutionary product that ${this.product.details.toLowerCase()}. This innovative solution offers unparalleled performance and reliability, making it the perfect choice for discerning customers who demand excellence.`;

    this.supabaseService
      .addProductDescription(
        this.product.name,
        this.product.details,
        dummyDescription,
        this.product.tone
      )
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.submitted = false;
          this.selectedProduct = null;
          this.product = {
            name: "",
            details: "",
            tone: "professional",
          };
          this.loadProductDescriptions();
        },
        error: (error) => {
          console.error("Error saving product description:", error);
          this.error = "Failed to save product description";
          this.isLoading = false;
        },
      });
  }
*/
  selectPlatform(platform: "instagram" | "pinterest" | "facebook") {
    this.socialOptions.platform = platform;
  }

  generateSocialContent() {
    if (!this.selectedProduct) return;

    this.isGeneratingSocial = true;

    // Simulate AI content generation with a dummy response
    setTimeout(() => {
      const dummyContent = this.generateDummySocialContent();
      this.generatedSocialContent = {
        id: "dummy-id",
        product_id: this.selectedProduct!.id,
        platform: this.socialOptions.platform,
        content: dummyContent.content,
        hashtags: dummyContent.hashtags,
        created_at: new Date().toISOString(),
        options: { ...this.socialOptions },
      };
      this.isGeneratingSocial = false;
    }, 1500);
  }

  private generateDummySocialContent() {
    const {
      platform,
      contentType,
      tone,
      includePrice,
      includeCTA,
      targetAudience,
      promotionalAngle,
    } = this.socialOptions;

    let content = "";
    let hashtags = "";

    // Generate dummy content based on options
    switch (contentType) {
      case "product_showcase":
        content = `✨ Discover the amazing ${this.selectedProduct!.name}! ${
          this.selectedProduct!.description
        }`;
        break;
      case "lifestyle":
        content = `Transform your life with the ${
          this.selectedProduct!.name
        }. Imagine the possibilities!`;
        break;
      case "promotional":
        content = `🔥 Special offer alert! Don't miss out on the incredible ${
          this.selectedProduct!.name
        }`;
        break;
      case "educational":
        content = `Did you know? The ${
          this.selectedProduct!.name
        } is revolutionizing the way we think about technology.`;
        break;
    }

    if (includePrice) {
      content += `\n\nPrice: $${this.selectedProduct!.price}`;
    }

    if (includeCTA) {
      content += "\n\nShop now! Link in bio. 👆";
    }

    // Generate platform-specific hashtags
    switch (platform) {
      case "instagram":
        hashtags = "#ProductLaunch #MustHave #Innovation #TechLife #Shopping";
        break;
      case "pinterest":
        hashtags = "#ProductInspo #Innovation #Shopping #Lifestyle #Tech";
        break;
      case "facebook":
        hashtags = "#NewProduct #Innovation #MustHave #Shopping";
        break;
    }

    return { content, hashtags };
  }


  setActivePlatform(platform: 'instagram' | 'pinterest' | 'facebook') {
    this.activePlatform = platform;
  }

  getContentByPlatform(platform: string): SocialPromoContent[] {
    return this.savedSocialContent.filter(content => content.platform === platform);
  }

  // Image generation methods
  selectImagePlatform(platform: 'instagram' | 'pinterest' | 'facebook') {
    this.imageOptions.platform = platform;
  }

  selectAspectRatio(ratio: '1:1' | '4:5' | '16:9' | '9:16') {
    this.imageOptions.aspectRatio = ratio;
  }

  // Save generated social content
  saveSocialContent(content: SocialPromoContent) {
    this.supabaseService.saveSocialContent(content).subscribe({
      next: (savedContent) => {
        this.savedSocialContent = [savedContent, ...this.savedSocialContent];
        Swal.fire({
          title: 'Success!',
          text: 'Content has been saved successfully',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#2563eb'
        });
      },
      error: (error) => {
        console.error('Error saving social content:', error);
        Swal.fire({
          title: 'Error',
          text: 'Failed to save social content',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#2563eb'
        });
      }
    });
  }

  generateImage() {
    if (!this.selectedProduct) return;

    this.isGeneratingImage = true;

    // Simulate API call with dummy image
    setTimeout(() => {
      this.generatedImage = {
        id: 'dummy-image-id',
        product_id: this.selectedProduct!.id,
        platform: this.imageOptions.platform,
        imageUrl: 'https://picsum.photos/800/800', // Random image from Lorem Picsum
        prompt: `Generate a ${this.imageOptions.style} product image for ${this.selectedProduct!.name} with ${this.imageOptions.mood} mood and ${this.imageOptions.composition} composition. Platform: ${this.imageOptions.platform}, Aspect ratio: ${this.imageOptions.aspectRatio}`,
        options: { ...this.imageOptions },
        created_at: new Date().toISOString()
      };
      this.isGeneratingImage = false;

      Swal.fire({
        title: 'Image Generated!',
        text: 'Your promotional image has been generated successfully.',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#2563eb'
      });
    }, 2000);
  }
  // Delete saved social content
  deleteSavedSocialContent(contentId: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#6b7280'
    }).then((result) => {
      if (result.isConfirmed) {
        this.supabaseService.deleteSocialContent(contentId).subscribe({
          next: () => {
            this.savedSocialContent = this.savedSocialContent.filter(content => content.id !== contentId);
            Swal.fire({
              title: 'Deleted!',
              text: 'Content has been deleted successfully',
              icon: 'success',
              confirmButtonText: 'OK',
              confirmButtonColor: '#2563eb'
            });
          },
          error: (error) => {
            console.error('Error deleting social content:', error);
            Swal.fire({
              title: 'Error',
              text: 'Failed to delete content',
              icon: 'error',
              confirmButtonText: 'OK',
              confirmButtonColor: '#2563eb'
            });
          }
        });
      }
    });
  }

  onProductSelect(product: Product) {
    this.selectedProduct = product;
  }

  onDescriptionGenerated() {
    this.loadProductDescriptions();
  }
}