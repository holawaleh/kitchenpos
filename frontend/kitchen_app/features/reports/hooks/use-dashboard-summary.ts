"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  getDashboardSummary,
} from "../services/report.service";

import {
  getApiErrorMessage,
} from "@/services/api/client";

import {
  DashboardSummary,
} from "../types/report.types";

export function useDashboardSummary() {
  const [summary, setSummary] =
    useState<DashboardSummary | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  async function fetchSummary() {
    try {
      setLoading(true);

      const response =
        await getDashboardSummary();

      setSummary(response);

      setError("");
    } catch (err) {
      console.error(err);

      setError(
        getApiErrorMessage(
          err,
          "Failed to load dashboard"
        )
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSummary();
  }, []);

  return {
    summary,
    loading,
    error,
    refresh:
      fetchSummary,
  };
}
