/**
 * ==========================================================
 * FrameTogether
 * Capture Frame
 * ==========================================================
 *
 * Responsible for capturing the current frame from
 * a HTMLVideoElement and applying a filter.
 *
 * Responsibilities
 *
 * ✔ Capture current frame
 * ✔ Apply filter to canvas
 * ✔ Draw onto canvas
 * ✔ Convert to PNG
 * ✔ Return Base64 Image
 *
 * This file should NEVER know anything about:
 *
 * - WebRTC
 * - Socket.IO
 * - Sessions
 * - Booth
 *
 * It simply converts:
 *
 * Video
 *   ↓
 * Canvas
 *   ↓
 * Apply Filter
 *   ↓
 * PNG Image
 *
 * ==========================================================
 */

import { getFilter } from "./filter";

/**
 * Capture current frame from a video element with optional filter.
 *
 * @param {HTMLVideoElement} videoElement
 * @param {string} filterKey - Filter name (e.g. "classic", "vintage")
 * @returns {string|null} Base64 PNG Image
 */
export default function captureFrame(videoElement, filterKey = "classic") {
  /**
   * ==========================================
   * Validate Video Element
   * ==========================================
   */
  if (!videoElement) {
    console.warn("captureFrame(): Video element not found.");
    return null;
  }

  /**
   * ==========================================
   * Ensure Video Is Ready
   * ==========================================
   */
  if (
    videoElement.readyState < 2 ||
    videoElement.videoWidth === 0 ||
    videoElement.videoHeight === 0
  ) {
    console.warn("captureFrame(): Video stream is not ready.");
    return null;
  }

  /**
   * ==========================================
   * Get Filter Preset
   * ==========================================
   */
  const filter = getFilter(filterKey);

  /**
   * ==========================================
   * Create Canvas
   * ==========================================
   */
  const canvas = document.createElement("canvas");
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;
  const context = canvas.getContext("2d");

  if (!context) {
    console.error("captureFrame(): Unable to create canvas context.");
    return null;
  }

  /**
   * ==========================================
   * Apply Filter to Canvas Context
   * ==========================================
   */
  if (filter.canvas && filter.canvas !== "none") {
    // Check if browser supports context.filter
    if (supportsCanvasFilter(context)) {
      context.filter = filter.canvas;
    } else {
      // Fallback: warn but still capture (unfiltered)
      console.warn(
        `captureFrame(): Canvas filters not supported on this device. Image will be unfiltered.`
      );
    }
  }

  /**
   * Draw Current Frame
   * ==========================================
   */
  context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

  /**
   * Convert Canvas → Base64 PNG
   * ==========================================
   */
  const image = canvas.toDataURL("image/png");

  console.log("=================================");
  console.log("FRAME CAPTURED");
  console.log("Filter:", filterKey);
  console.log("Resolution:", canvas.width, "x", canvas.height);
  console.log("=================================");

  return image;
}

/**
 * Check if browser supports canvas.filter
 */
function supportsCanvasFilter(context) {
  try {
    context.filter = "brightness(1)";
    context.filter = "none"; // Reset
    return true;
  } catch (e) {
    return false;
  }
}