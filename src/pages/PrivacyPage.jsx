import React from "react";
import { Shield } from "lucide-react";

/**
 * PrivacyPage component displaying the platform's privacy policy
 */
export default function PrivacyPage() {
  const lastUpdated = "April 2, 2026";

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-stone-100 rounded-full mb-6">
          <Shield className="w-8 h-8 text-stone-900" />
        </div>
        <h1 className="text-5xl font-serif font-bold italic mb-4">Privacy Policy</h1>
        <p className="text-stone-500 font-light">Last Updated: {lastUpdated}</p>
      </div>

      <div className="prose prose-stone prose-lg max-w-none bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-stone-100">
        <p className="lead text-xl text-stone-600 mb-8">
          Welcome to The Baobab Times (“we”, “our”, “us”). We are committed to protecting your privacy and ensuring transparency in how your personal information is collected, used, and stored.
        </p>

        <p className="mb-12">
          This Privacy Policy explains how we handle your data when you use our platform.
        </p>

        <section className="mb-12">
          <h2 className="text-2xl font-serif font-bold mb-6 border-b border-stone-100 pb-2">1. Information We Collect</h2>
          <p className="mb-4">We may collect the following types of information:</p>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold mb-2">a. Personal Information</h3>
              <p className="text-stone-600 mb-2">When you create an account or interact with the platform:</p>
              <ul className="list-disc pl-6 space-y-1 text-stone-600">
                <li>Full name</li>
                <li>Email address</li>
                <li>Job title / department</li>
                <li>Profile photo (if uploaded)</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-2">b. User-Generated Content</h3>
              <ul className="list-disc pl-6 space-y-1 text-stone-600">
                <li>Articles and posts</li>
                <li>“From the CEO” messages</li>
                <li>Recognition submissions</li>
                <li>Questions submitted via “Ask the CEO”</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-2">c. Engagement Data</h3>
              <ul className="list-disc pl-6 space-y-1 text-stone-600">
                <li>Likes and reactions</li>
                <li>Recognition activity</li>
                <li>Interactions with articles and content</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-2">d. Technical Data</h3>
              <ul className="list-disc pl-6 space-y-1 text-stone-600">
                <li>IP address</li>
                <li>Device type</li>
                <li>Browser type</li>
                <li>Usage analytics (e.g., pages visited, time spent)</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-serif font-bold mb-6 border-b border-stone-100 pb-2">2. How We Use Your Information</h2>
          <p className="mb-4">We use your data to:</p>
          <ul className="list-disc pl-6 space-y-2 text-stone-600">
            <li>Provide and operate the platform</li>
            <li>Display user profiles and contributions</li>
            <li>Enable recognition and engagement features</li>
            <li>Allow communication between employees and leadership</li>
            <li>Improve user experience and platform performance</li>
            <li>Monitor usage and prevent misuse</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-serif font-bold mb-6 border-b border-stone-100 pb-2">3. Role-Based Access & Visibility</h2>
          <p className="mb-4">Your information may be visible depending on your role:</p>
          <ul className="list-disc pl-6 space-y-2 text-stone-600">
            <li><strong>CEO:</strong> Full platform access, including publishing and responding to questions</li>
            <li><strong>Admin:</strong> Access to dashboard and content management</li>
            <li><strong>Employees:</strong> Limited access (e.g., recognitions, viewing content)</li>
          </ul>
          <p className="mt-4 text-stone-600 italic">
            Certain content (e.g., recognitions or articles) may be visible to all users within the organization.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-serif font-bold mb-6 border-b border-stone-100 pb-2">4. Profile Images & Media</h2>
          <ul className="list-disc pl-6 space-y-2 text-stone-600">
            <li>Users may upload profile images and media files</li>
            <li>Uploaded files are stored securely using cloud storage services</li>
            <li>If no image is uploaded, a default avatar may be used</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-serif font-bold mb-6 border-b border-stone-100 pb-2">5. Data Storage & Security</h2>
          <p className="mb-4">We use secure third-party services (e.g., Firebase) to store and manage data.</p>
          <p className="mb-4">We take reasonable measures to:</p>
          <ul className="list-disc pl-6 space-y-2 text-stone-600">
            <li>Protect against unauthorized access</li>
            <li>Secure user authentication</li>
            <li>Prevent data loss or misuse</li>
          </ul>
          <p className="mt-4 text-stone-500 text-sm">However, no system is 100% secure.</p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-serif font-bold mb-6 border-b border-stone-100 pb-2">6. Sharing of Information</h2>
          <p className="mb-4">We do not sell your personal data.</p>
          <p className="mb-4">We may share information:</p>
          <ul className="list-disc pl-6 space-y-2 text-stone-600">
            <li>With internal administrators (for platform management)</li>
            <li>With service providers (e.g., hosting, storage, analytics)</li>
            <li>If required by law or legal obligation</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-serif font-bold mb-6 border-b border-stone-100 pb-2">7. Notifications</h2>
          <p className="mb-4">Users may receive notifications about:</p>
          <ul className="list-disc pl-6 space-y-1 text-stone-600 mb-4">
            <li>New articles</li>
            <li>CEO responses</li>
            <li>Recognitions</li>
            <li>Platform activity</li>
          </ul>
          <p className="text-stone-600">You may be able to manage notification preferences in your settings.</p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-serif font-bold mb-6 border-b border-stone-100 pb-2">8. Your Rights</h2>
          <p className="mb-4">You have the right to:</p>
          <ul className="list-disc pl-6 space-y-2 text-stone-600">
            <li>Access your personal data</li>
            <li>Update your profile information</li>
            <li>Request deletion of your account</li>
            <li>Control certain visibility settings</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-serif font-bold mb-6 border-b border-stone-100 pb-2">9. Data Retention</h2>
          <p className="mb-4">We retain your data:</p>
          <ul className="list-disc pl-6 space-y-2 text-stone-600">
            <li>As long as your account is active</li>
            <li>Or as necessary for platform functionality and compliance</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-serif font-bold mb-6 border-b border-stone-100 pb-2">10. Cookies & Tracking</h2>
          <p className="mb-4">We may use cookies or similar technologies to:</p>
          <ul className="list-disc pl-6 space-y-2 text-stone-600">
            <li>Improve performance</li>
            <li>Analyze usage</li>
            <li>Enhance user experience</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-serif font-bold mb-6 border-b border-stone-100 pb-2">11. Children’s Privacy</h2>
          <p className="text-stone-600">
            This platform is intended for internal organizational use and is not designed for children under 13.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif font-bold mb-6 border-b border-stone-100 pb-2">12. Changes to This Policy</h2>
          <p className="text-stone-600">
            We may update this Privacy Policy from time to time. Changes will be reflected with an updated “Last Updated” date.
          </p>
        </section>
      </div>
    </div>
  );
}
