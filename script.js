// Mobile Navigation Toggle
class MobileNavigation {
  constructor() {
    this.navToggle = document.getElementById("nav-toggle")
    this.navMenu = document.getElementById("nav-menu")
    this.init()
  }

  init() {
    if (this.navToggle && this.navMenu) {
      this.navToggle.addEventListener("click", () => {
        this.navMenu.classList.toggle("active")
        this.navToggle.classList.toggle("active")
      })

      // Close mobile menu when clicking on a link
      const navLinks = document.querySelectorAll(".nav-link")
      navLinks.forEach((link) => {
        link.addEventListener("click", () => {
          this.navMenu.classList.remove("active")
          this.navToggle.classList.remove("active")
        })
      })
    }
  }
}

// Hero Slider Functionality (for the main website)
class HeroSlider {
  constructor() {
    this.slides = document.querySelectorAll(".hero-slider .slide")
    this.indicators = document.querySelectorAll(".hero-slider .indicator")
    this.prevBtn = document.getElementById("prevBtn")
    this.nextBtn = document.getElementById("nextBtn")
    this.currentSlide = 0
    this.slideInterval = null

    this.init()
  }

  init() {
    if (this.slides.length === 0) return

    // Add event listeners
    this.prevBtn?.addEventListener("click", () => this.prevSlide())
    this.nextBtn?.addEventListener("click", () => this.nextSlide())

    // Indicator click events
    this.indicators.forEach((indicator, index) => {
      indicator.addEventListener("click", () => this.goToSlide(index))
    })

    // Auto-play slider
    this.startAutoPlay()

    // Pause auto-play on hover
    const sliderContainer = document.querySelector(".hero-slider")
    if (sliderContainer) {
      sliderContainer.addEventListener("mouseenter", () => this.stopAutoPlay())
      sliderContainer.addEventListener("mouseleave", () => this.startAutoPlay())
    }

    // Touch/swipe support
    this.addTouchSupport()
  }

  showSlide(index) {
    this.slides.forEach((slide) => slide.classList.remove("active"))
    this.indicators.forEach((indicator) => indicator.classList.remove("active"))

    if (this.slides[index]) {
      this.slides[index].classList.add("active")
    }
    if (this.indicators[index]) {
      this.indicators[index].classList.add("active")
    }

    this.currentSlide = index
  }

  nextSlide() {
    const nextIndex = (this.currentSlide + 1) % this.slides.length
    this.showSlide(nextIndex)
  }

  prevSlide() {
    const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length
    this.showSlide(prevIndex)
  }

  goToSlide(index) {
    this.showSlide(index)
  }

  startAutoPlay() {
    this.stopAutoPlay()
    this.slideInterval = setInterval(() => {
      this.nextSlide()
    }, 5000)
  }

  stopAutoPlay() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval)
      this.slideInterval = null
    }
  }

  addTouchSupport() {
    const sliderContainer = document.querySelector(".hero-slider .slider-container")
    if (!sliderContainer) return

    let startX = 0
    let endX = 0

    sliderContainer.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX
    })

    sliderContainer.addEventListener("touchend", (e) => {
      endX = e.changedTouches[0].clientX
      this.handleSwipe(startX, endX)
    })
  }

  handleSwipe(startX, endX) {
    const threshold = 50
    const diff = startX - endX

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        this.nextSlide()
      } else {
        this.prevSlide()
      }
    }
  }
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
  const links = document.querySelectorAll('a[href^="#"]')

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault()
      const targetId = link.getAttribute("href")
      const targetElement = document.querySelector(targetId)

      if (targetElement) {
        const offsetTop = targetElement.offsetTop - 70
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        })
      }
    })
  })
}

// Intersection Observer for animations
class ScrollAnimations {
  constructor() {
    this.init()
  }

  init() {
    this.initScrollAnimations()
    this.initCounterAnimations()
    this.initParallaxEffect()
  }

  initScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate")

          // Add stagger effect for multiple elements
          const siblings = entry.target.parentElement?.querySelectorAll(".scroll-animate")
          if (siblings && siblings.length > 1) {
            siblings.forEach((sibling, index) => {
              setTimeout(() => {
                sibling.classList.add("animate")
              }, index * 100)
            })
          }
        }
      })
    }, observerOptions)

    // Observe elements that should animate on scroll
    const animateElements = document.querySelectorAll(".scroll-animate")
    animateElements.forEach((el) => {
      observer.observe(el)
    })
  }

  initCounterAnimations() {
    const counters = document.querySelectorAll(".counter")

    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.animateCounter(entry.target)
            counterObserver.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.5 },
    )

    counters.forEach((counter) => {
      counterObserver.observe(counter)
    })
  }

  animateCounter(element) {
    const target = Number.parseInt(element.getAttribute("data-target"))
    const duration = 2000
    const increment = target / (duration / 16)
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        current = target
        clearInterval(timer)
      }
      // Format for millions if target is large
      if (target >= 1000000) {
        element.textContent = Math.floor(current / 1000000) + "M+"
      } else if (target >= 1000) {
        element.textContent = Math.floor(current / 1000) + "K+"
      } else {
        element.textContent = Math.floor(current) + "+"
      }
    }, 16)
  }

  initParallaxEffect() {
    const hero = document.querySelector(".hero-slider")

    if (hero) {
      window.addEventListener("scroll", () => {
        const scrolled = window.pageYOffset
        const rate = scrolled * -0.3
        hero.style.transform = `translateY(${rate}px)`
      })
    }
  }
}

// Navbar background on scroll
function initNavbarScroll() {
  const navbar = document.querySelector(".navbar")

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.style.background = "rgba(0, 0, 0, 0.95)"
      navbar.style.backdropFilter = "blur(15px)"
    } else {
      navbar.style.background = "rgba(0, 0, 0, 0.9)"
      navbar.style.backdropFilter = "blur(10px)"
    }
  })
}

// Age Verification System
class AgeVerification {
  constructor() {
    this.ageScreen = document.getElementById("age-verification")
    this.uneligibleScreen = document.getElementById("uneligible-screen")
    this.splashScreen = document.getElementById("splash-screen")
    this.mainWebsite = document.getElementById("main-website")

    this.init()
  }

  init() {
    // If age verification screen exists, show it. Otherwise, go straight to main website.
    if (this.ageScreen) {
      this.showAgeVerification()
      // Add event listeners only if age screen is present
      document.getElementById("underAge")?.addEventListener("click", () => this.showUneligible())
      document.getElementById("overAge")?.addEventListener("click", () => this.showSplash())
    } else {
      this.showMainWebsite()
    }
  }

  showAgeVerification() {
    this.ageScreen.classList.add("active")
  }

  showUneligible() {
    this.ageScreen.classList.remove("active")
    setTimeout(() => {
      this.uneligibleScreen.classList.add("active")
    }, 500)
  }

  showSplash() {
    this.ageScreen.classList.remove("active")
    setTimeout(() => {
      this.splashScreen.classList.add("active")
      new SplashScreen() // Initialize splash screen after it becomes active
    }, 500)
  }

  showMainWebsite() {
    // Ensure splash screen is removed if it was active
    if (this.splashScreen) {
      this.splashScreen.classList.remove("active")
    }
    // Check if mainWebsite element exists before adding class and initializing
    if (this.mainWebsite) {
      setTimeout(() => {
        this.mainWebsite.classList.add("active")
        this.initMainWebsite() // Initialize main website components
      }, 500)
    } else {
      // If mainWebsite element is not found (e.g., on products.html opened directly),
      // still initialize main website components.
      this.initMainWebsite()
    }
  }

  initMainWebsite() {
    // Initialize components based on the current page
    const currentPage = window.location.pathname.split("/").pop()

    if (currentPage === "" || currentPage === "index.html") {
      new HeroSlider()
      new ProductShowcaseSlider() // Initialize the new product showcase slider
      new ProductLoader() // For featured products on index.html
    } else if (currentPage === "products.html") {
      new ProductCategoryLoader() // For categorized products on products.html
    }

    // These components are common to all main website pages
    new MobileNavigation()
    new ScrollAnimations()
    initSmoothScrolling()
    initNavbarScroll()
  }
}

// Enhanced Splash Screen System
class SplashScreen {
  constructor() {
    this.slides = document.querySelectorAll(".splash-slide")
    this.indicators = document.querySelectorAll(".splash-indicator") // Get indicators
    this.skipBtn = document.getElementById("skipSplash")
    this.skipBtnMobile = document.getElementById("skipSplashMobile")
    this.currentSlide = 0
    this.slideInterval = null
    this.slideDuration = 4000 // 4 seconds per slide

    this.init()
  }

  init() {
    // Start auto-play
    this.startAutoPlay()

    // Add event listeners for skip buttons
    this.skipBtn?.addEventListener("click", () => this.goToMainWebsite())
    this.skipBtnMobile?.addEventListener("click", () => this.goToMainWebsite())

    // Indicator click events
    this.indicators.forEach((indicator, index) => {
      indicator.addEventListener("click", () => {
        this.goToSlide(index)
        this.stopAutoPlay() // Stop auto-play on manual interaction
        this.startAutoPlay() // Restart auto-play
      })
    })

    // Touch/swipe support
    this.addTouchSupport()

    // Keyboard support
    this.addKeyboardSupport()
  }

  showSlide(index) {
    // Remove active classes from all slides and indicators
    this.slides.forEach((slide) => {
      slide.classList.remove("active", "prev")
    })
    this.indicators.forEach((indicator) => indicator.classList.remove("active"))

    // Add prev class to current slide for transition effect (before changing currentSlide)
    if (this.slides[this.currentSlide]) {
      this.slides[this.currentSlide].classList.add("prev")
    }

    // Show new slide
    if (this.slides[index]) {
      setTimeout(() => {
        this.slides[index].classList.add("active")
      }, 100) // Small delay to allow 'prev' class to apply
    }
    // Activate corresponding indicator
    if (this.indicators[index]) {
      this.indicators[index].classList.add("active")
    }

    this.currentSlide = index
  }

  nextSlide() {
    const nextIndex = (this.currentSlide + 1) % this.slides.length
    this.showSlide(nextIndex)
  }

  goToSlide(index) {
    this.showSlide(index)
  }

  startAutoPlay() {
    this.stopAutoPlay() // Clear any existing interval
    this.slideInterval = setInterval(() => {
      this.nextSlide()
    }, this.slideDuration)
  }

  stopAutoPlay() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval)
      this.slideInterval = null
    }
  }

  addTouchSupport() {
    const splashContainer = document.querySelector(".splash-slider-container")
    if (!splashContainer) return

    let startX = 0
    let endX = 0

    splashContainer.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX
      this.stopAutoPlay() // Pause on touch
    })

    splashContainer.addEventListener("touchend", (e) => {
      endX = e.changedTouches[0].clientX
      this.handleSwipe(startX, endX)
      this.startAutoPlay() // Resume after swipe
    })
  }

  handleSwipe(startX, endX) {
    const threshold = 50
    const diff = startX - endX

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        // Swiped left - next slide
        this.nextSlide()
      } else {
        // Swiped right - previous slide
        const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length
        this.goToSlide(prevIndex)
      }
    }
  }

  addKeyboardSupport() {
    document.addEventListener("keydown", (e) => {
      // Only respond if splash screen is active
      if (!document.getElementById("splash-screen")?.classList.contains("active")) return

      switch (e.key) {
        case "ArrowRight":
        case " ": // Spacebar
          e.preventDefault()
          this.nextSlide()
          this.stopAutoPlay() // Stop auto-play on manual interaction
          this.startAutoPlay() // Restart auto-play
          break
        case "ArrowLeft":
          e.preventDefault()
          const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length
          this.goToSlide(prevIndex)
          this.stopAutoPlay() // Stop auto-play on manual interaction
          this.startAutoPlay() // Restart auto-play
          break
        case "Enter":
        case "Escape":
          e.preventDefault()
          this.goToMainWebsite()
          break
      }
    })
  }

  goToMainWebsite() {
    this.stopAutoPlay()
    window.ageVerification.showMainWebsite()
  }
}

// New Product Showcase Slider Functionality
class ProductShowcaseSlider {
  constructor() {
    this.slides = document.querySelectorAll(".product-showcase-slider .slide")
    this.indicators = document.querySelectorAll(".product-showcase-slider .indicator")
    this.prevBtn = document.getElementById("productShowcasePrevBtn")
    this.nextBtn = document.getElementById("productShowcaseNextBtn")
    this.currentSlide = 0
    this.slideInterval = null
    this.slideDuration = 4000 // 4 seconds per slide

    this.init()
  }

  init() {
    if (this.slides.length === 0) return

    // Add event listeners
    this.prevBtn?.addEventListener("click", () => this.prevSlide())
    this.nextBtn?.addEventListener("click", () => this.nextSlide())

    // Indicator click events
    this.indicators.forEach((indicator, index) => {
      indicator.addEventListener("click", () => this.goToSlide(index))
    })

    // Auto-play slider
    this.startAutoPlay()

    // Pause auto-play on hover
    const sliderContainer = document.querySelector(".product-showcase-slider")
    if (sliderContainer) {
      sliderContainer.addEventListener("mouseenter", () => this.stopAutoPlay())
      sliderContainer.addEventListener("mouseleave", () => this.startAutoPlay())
    }

    // Touch/swipe support
    this.addTouchSupport()
  }

  showSlide(index) {
    this.slides.forEach((slide) => slide.classList.remove("active"))
    this.indicators.forEach((indicator) => indicator.classList.remove("active"))

    if (this.slides[index]) {
      this.slides[index].classList.add("active")
    }
    if (this.indicators[index]) {
      this.indicators[index].classList.add("active")
    }

    this.currentSlide = index
  }

  nextSlide() {
    const nextIndex = (this.currentSlide + 1) % this.slides.length
    this.showSlide(nextIndex)
  }

  prevSlide() {
    const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length
    this.showSlide(prevIndex)
  }

  goToSlide(index) {
    this.showSlide(index)
  }

  startAutoPlay() {
    this.stopAutoPlay()
    this.slideInterval = setInterval(() => {
      this.nextSlide()
    }, this.slideDuration)
  }

  stopAutoPlay() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval)
      this.slideInterval = null
    }
  }

  addTouchSupport() {
    const sliderContainer = document.querySelector(".product-showcase-slider .slider-container")
    if (!sliderContainer) return

    let startX = 0
    let endX = 0

    sliderContainer.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX
      this.stopAutoPlay() // Pause on touch
    })

    sliderContainer.addEventListener("touchend", (e) => {
      endX = e.changedTouches[0].clientX
      this.handleSwipe(startX, endX)
      this.startAutoPlay() // Resume after swipe
    })
  }

  handleSwipe(startX, endX) {
    const threshold = 50
    const diff = startX - endX

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        this.nextSlide()
      } else {
        this.prevSlide()
      }
    }
  }
}

// Product Loader for index.html (Featured Products)
class ProductLoader {
  constructor() {
    this.productsContainer = document.getElementById("products-grid")
    // Assumes productsData is globally available from data.js
    this.init()
  }

  init() {
    if (this.productsContainer) {
      this.loadProducts()
    }
  }

  loadProducts() {
    // Ensure window.productsData and its featured property exist
    if (!this.productsContainer || !window.productsData || !window.productsData.featured) {
      console.error("ProductLoader: productsData.featured is not available or container not found.")
      return
    }

    this.productsContainer.innerHTML = ""

    window.productsData.featured.forEach((product, index) => {
      const productCard = this.createProductCard(product, index)
      this.productsContainer.appendChild(productCard)
    })

    this.animateProducts()
  }

  createProductCard(product, index) {
    const card = document.createElement("div")
    card.className = "product-card"
    card.style.transitionDelay = `${index * 0.1}s`

    const stars = "★".repeat(Math.floor(product.rating)) + "☆".repeat(5 - Math.floor(product.rating))
    const featuresList = product.features.map((feature) => `<li>${feature}</li>`).join("")

    card.innerHTML = `
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
      </div>
      <div class="product-info">
        <p class="product-category">${product.category}</p>
        <h3 class="product-name">${product.name}</h3>
        <p class="product-description">${product.description}</p>
        <ul class="product-features">
          ${featuresList}
        </ul>
        <div class="product-rating">
          <span class="stars">${stars}</span>
          <span class="rating-text">(${product.rating})</span>
        </div>
        <div class="product-price">${product.price}</div>
        <button class="product-btn">SHOP NOW</button>
      </div>
    `
    return card
  }

  animateProducts() {
    const productCards = document.querySelectorAll(".product-card")

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add("animate")
            }, 100)
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      },
    )

    productCards.forEach((card) => {
      observer.observe(card)
    })
  }
}

// Product Category Loader for products.html
class ProductCategoryLoader {
  constructor() {
    // Assumes productsData is globally available from data.js
    this.init()
  }

  init() {
    // Ensure window.productsData and its categories property exist
    if (window.productsData && window.productsData.categories) {
      this.loadCategories()
    } else {
      console.error("ProductCategoryLoader: productsData.categories is not available.")
    }
  }

  loadCategories() {
    window.productsData.categories.forEach((category) => {
      // Determine the target grid ID based on category name
      const categoryId = category.name.toLowerCase().replace(/\s/g, "-") + "-grid"
      const container = document.getElementById(categoryId)

      if (container) {
        container.innerHTML = "" // Clear existing hardcoded content

        category.products.forEach((product, index) => {
          const productCard = this.createCategoryProductCard(product, index)
          container.appendChild(productCard)
        })

        // Animate products in this category
        this.animateProducts(container)
      } else {
        console.warn(
          `ProductCategoryLoader: Container with ID '${categoryId}' not found for category '${category.name}'.`,
        )
      }
    })
  }

  createCategoryProductCard(product, index) {
    const card = document.createElement("div")
    card.className = "product-card"
    card.style.transitionDelay = `${index * 0.1}s` // Stagger animation

    card.innerHTML = `
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
      </div>
      <div class="product-info">
        <h3 class="product-name">${product.name}</h3>
        <button class="product-btn">SHOP NOW</button>
      </div>
    `
    return card
  }

  animateProducts(container) {
    const productCards = container.querySelectorAll(".product-card")

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add("animate")
            }, 100)
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      },
    )

    productCards.forEach((card) => {
      observer.observe(card)
    })
  }
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize age verification system
  window.ageVerification = new AgeVerification()

  // Add button hover effects
  const buttons = document.querySelectorAll(
    ".cta-button, .product-btn, .splash-shop-btn, .age-btn, .skip-btn, .skip-btn-mobile",
  )
  buttons.forEach((button) => {
    button.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-2px)"
    })

    button.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)"
    })
  })
})

// Handle window resize
window.addEventListener("resize", () => {
  const navMenu = document.getElementById("nav-menu")
  const navToggle = document.getElementById("nav-toggle")

  if (window.innerWidth > 768) {
    if (navMenu) navMenu.classList.remove("active")
    if (navToggle) navToggle.classList.remove("active")
  }
})

// Performance optimization
window.addEventListener("load", () => {
  // Preload critical images
  const criticalImages = [
    "/placeholder.svg?height=300&width=300",
    "/placeholder.svg?height=300&width=300",
    "/placeholder.svg?height=300&width=300",
  ]

  criticalImages.forEach((src) => {
    const img = new Image()
    img.src = src
  })
})
