import React from "react";
import { FileText } from "lucide-react";

/**
 * TermsPage component displaying the platform's terms of service
 */
export default function TermsPage() {
  const lastUpdated = "April 2, 2026";

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-stone-100 rounded-full mb-6">
          <FileText className="w-8 h-8 text-stone-900" />
        </div>
        <h1 className="text-5xl font-serif font-bold italic mb-4">Terms of Service</h1>
        <p className="text-stone-500 font-light">Last Updated: {lastUpdated}</p>
      </div>

      <div className="prose prose-stone prose-lg max-w-none bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-stone-100">
        <p className="lead text-xl text-stone-600 mb-8">
          Welcome to The Baobab Times (“Platform”, “we”, “our”, “us”). By accessing or using this platform, you agree to comply with and be bound by these Terms of Service.
        </p>

        <p className="mb-12">
          If you do not agree with these terms, you should not use the platform.
        </p>

        <section className="mb-12">
          <h2 className="text-2xl font-serif font-bold mb-6 border-b border-stone-100 pb-2">1. Purpose of the Platform</h2>
          <p className="mb-4">The Baobab Times is an internal communication and engagement platform designed to:</p>
          <ul className="list-disc pl-6 space-y-2 text-stone-600">
            <li>Share company news and leadership messages</li>
            <li>Enable employee recognition</li>
            <li>Facilitate communication with leadership (“Ask the CEO”)</li>
            <li>Encourage collaboration and engagement across the organization</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-serif font-bold mb-6 border-b border-stone-100 pb-2">2. User Roles & Access</h2>
          <p className="mb-4">Access to the platform is role-based:</p>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold mb-2">CEO</h3>
              <ul className="list-disc pl-6 space-y-1 text-stone-600">
                <li>Full access to all features</li>
                <li>Can publish “From the CEO” content</li>
                <li>Can respond to employee questions</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2">Admin</h3>
              <ul className="list-disc pl-6 space-y-1 text-stone-600">
                <li>Can manage articles and content</li>
                <li>Has access to dashboard functionality</li>
                <li>Cannot access CEO-exclusive features</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2">Employees</h3>
              <ul className="list-disc pl-6 space-y-1 text-stone-600">
                <li>Can view content</li>
                <li>Can submit recognitions</li>
                <li>Can participate in engagement features</li>
              </ul>
            </div>
          </div>
          <p className="mt-4 text-stone-600 italic">You are responsible for using your access appropriately.</p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-serif font-bold mb-6 border-b border-stone-100 pb-2">3. Account Responsibility</h2>
          <p className="mb-4">You agree to:</p>
          <ul className="list-disc pl-6 space-y-2 text-stone-600">
            <li>Provide accurate information when creating your account</li>
            <li>Maintain the confidentiality of your login credentials</li>
            <li>Notify administrators of any unauthorized access</li>
          </ul>
          <p className="mt-4 text-stone-600">You are responsible for all activity under your account.</p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-serif font-bold mb-6 border-b border-stone-100 pb-2">4. Acceptable Use</h2>
          <p className="mb-4">You agree NOT to:</p>
          <ul className="list-disc pl-6 space-y-2 text-stone-600">
            <li>Post harmful, offensive, or inappropriate content</li>
            <li>Harass, abuse, or discriminate against others</li>
            <li>Share confidential company information without authorization</li>
            <li>Upload malicious files or attempt to disrupt the platform</li>
            <li>Impersonate another user</li>
          </ul>
          <p className="mt-4 text-stone-600">We reserve the right to remove content that violates these rules.</p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-serif font-bold mb-6 border-b border-stone-100 pb-2">5. User-Generated Content</h2>
          <p className="mb-4">You retain ownership of the content you create, including:</p>
          <ul className="list-disc pl-6 space-y-1 text-stone-600 mb-4">
            <li>Articles</li>
            <li>Recognitions</li>
            <li>Questions and responses</li>
          </ul>
          <p className="mb-4">However, by posting content, you grant us the right to:</p>
          <ul className="list-disc pl-6 space-y-1 text-stone-600">
            <li>Display and distribute it within the platform</li>
            <li>Use it to improve engagement features</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-serif font-bold mb-6 border-b border-stone-100 pb-2">6. Moderation & Content Control</h2>
          <p className="mb-4">We reserve the right to:</p>
          <ul className="list-disc pl-6 space-y-2 text-stone-600">
            <li>Review, edit, or remove content</li>
            <li>Moderate submissions before publishing (e.g., Ask the CEO)</li>
            <li>Suspend or restrict accounts that violate these terms</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-serif font-bold mb-6 border-b border-stone-100 pb-2">7. Recognition & Engagement Features</h2>
          <ul className="list-disc pl-6 space-y-2 text-stone-600">
            <li>Recognitions are intended to promote positive workplace culture</li>
            <li>Users may react to or engage with content</li>
            <li>Abuse of these features (e.g., spam or manipulation) is prohibited</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-serif font-bold mb-6 border-b border-stone-100 pb-2">8. Intellectual Property</h2>
          <p className="mb-4">All platform design, branding, and system functionality belong to: The Baobab Times / [Your Company Name]</p>
          <p className="mb-4">You may not:</p>
          <ul className="list-disc pl-6 space-y-2 text-stone-600">
            <li>Copy or reproduce the platform</li>
            <li>Reverse engineer the system</li>
            <li>Use branding without permission</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-serif font-bold mb-6 border-b border-stone-100 pb-2">9. Platform Availability</h2>
          <p className="mb-4">We aim to provide reliable access but do not guarantee:</p>
          <ul className="list-disc pl-6 space-y-1 text-stone-600 mb-4">
            <li>Continuous uptime</li>
            <li>Error-free performance</li>
          </ul>
          <p className="mb-4">We may:</p>
          <ul className="list-disc pl-6 space-y-1 text-stone-600">
            <li>Update features</li>
            <li>Modify or discontinue parts of the platform</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-serif font-bold mb-6 border-b border-stone-100 pb-2">10. Data & Privacy</h2>
          <p className="mb-4">Your use of the platform is also governed by our Privacy Policy.</p>
          <p className="mb-4">By using the platform, you consent to:</p>
          <ul className="list-disc pl-6 space-y-2 text-stone-600">
            <li>Collection and use of your data as outlined in that policy</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-serif font-bold mb-6 border-b border-stone-100 pb-2">11. Termination of Access</h2>
          <p className="mb-4">We may suspend or terminate your access if you:</p>
          <ul className="list-disc pl-6 space-y-2 text-stone-600">
            <li>Violate these Terms</li>
            <li>Misuse the platform</li>
            <li>Engage in harmful behavior</li>
          </ul>
          <p className="mt-4 text-stone-600">You may also request account deletion.</p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-serif font-bold mb-6 border-b border-stone-100 pb-2">12. Limitation of Liability</h2>
          <p className="mb-4 text-stone-600">To the fullest extent permitted by law:</p>
          <ul className="list-disc pl-6 space-y-2 text-stone-600">
            <li>We are not liable for any indirect or incidental damages</li>
            <li>We are not responsible for user-generated content</li>
          </ul>
          <p className="mt-4 text-stone-600">Use of the platform is at your own risk.</p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-serif font-bold mb-6 border-b border-stone-100 pb-2">13. Changes to These Terms</h2>
          <p className="text-stone-600 mb-4">We may update these Terms from time to time. Changes will be communicated via the platform.</p>
          <p className="text-stone-600 font-bold italic">Continued use = acceptance of updated terms.</p>
        </section>

        <section>
          <h2 className="text-2xl font-serif font-bold mb-6 border-b border-stone-100 pb-2">14. Governing Law</h2>
          <p className="text-stone-600">
            These Terms are governed by the laws of: [Insert Country / Jurisdiction — e.g., South Africa]
          </p>
        </section>
      </div>
    </div>
  );
}
