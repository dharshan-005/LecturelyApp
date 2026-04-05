import React, { useState, ChangeEvent, FormEvent } from "react";
import logo from "../../public/assets/LA.png";

// Define the shape of our form data
interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: "",
  });

  const [modalType, setModalType] = useState<"privacy" | "terms" | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState("");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setResult("Sending...");

    try {
      const formDataToSend = new FormData(event.currentTarget);
      formDataToSend.append(
        "access_key",
        "60daffcf-8ee5-4e15-aba2-8c1f3576816f",
      );

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (data.success) {
        setResult("Thank you for your feedback! ✨");

        // Reset React state (important)
        setFormData({
          name: "",
          email: "",
          subject: "General Inquiry",
          message: "",
        });
      } else {
        console.error(data);
        setResult("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setResult("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   setIsSubmitting(true);

  //   // Simulate API Call
  //   console.log("Form Data Submitted:", formData);

  //   setTimeout(() => {
  //     alert("Thank you! Your message has been sent.");
  //     setIsSubmitting(false);
  //     setFormData({
  //       name: "",
  //       email: "",
  //       subject: "General Inquiry",
  //       message: "",
  //     });
  //   }, 1000);
  // };

  return (
    <>
      <div
        id="contact"
        className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors md:ml-64"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-16 md:pt-16 md:mb-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left Column: Content */}
            <div className="flex flex-col justify-between">
              <div>
                <h1 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
                  Let's talk about{" "}
                  <span className="text-indigo-600">your lectures.</span>
                </h1>
                <p className="text-xl text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
                  Have a question about our AI transcription? Or just want to
                  say hi? Drop us a message and we'll get back to you within 24
                  hours.
                </p>
              </div>

              <div className="mt-12 space-y-8">
                {/* Tools Section (From your original design) */}
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">
                    Our Tech Stack
                  </h3>
                  <div className="flex gap-4">
                    <span className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-sm font-medium">
                      Text Summary
                    </span>
                    <span className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-sm font-medium">
                      Doc Summary
                    </span>
                  </div>
                </div>

                {/* <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-2">Email</h3>
                <a href="mailto:hello@lecturely.ai" className="text-xl font-semibold hover:text-indigo-600 transition-colors">
                  hello@lecturely.ai
                </a>
              </div> */}
              </div>

              {/* Header / Brand */}
              {/* <div className="flex items-center gap-3 mb-12">
                <a href="/" className="flex items-center gap-3 group">
                  <img
                    src={(logo as any).src || logo} // Handles both Next.js StaticImageData and standard string imports
                    alt="Lecturely Logo"
                    className="w-12 h-12 bg-black rounded-2xl p-1 transition-transform group-hover:scale-105"
                  />
                  <span className="font-bold text-3xl text-slate-800 dark:text-slate-100 tracking-tighter">
                    Lecturely.ai
                  </span>
                </a>
              </div> */}
            </div>

            {/* Right Column: Contact Form */}
            <div className="relative">
              <div className="absolute -inset-1 bg-linear-to-r from-indigo-600 to-cyan-500 rounded-3xl blur opacity-20"></div>
              <form
                onSubmit={onSubmit}
                className="relative bg-white dark:bg-slate-900 p-8 md:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter Your Name"
                      className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter Your Email"
                      className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
                    Subject
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  >
                    <option>General Inquiry</option>
                    <option>Technical Support</option>
                    <option>Billing</option>
                    <option>Feature Request</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
                    Message
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="How can we help you?"
                    className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-slate-950 dark:bg-indigo-600 text-white font-bold rounded-xl hover:opacity-90 transition transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>

                {result && (
                  <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                    {result}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Footer Branding */}
        <footer className="max-w-7xl mx-auto px-6 py-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            © 2025 Lecturely AI. All rights reserved.
          </p>
          <div className="flex gap-8 text-sm font-medium text-slate-600 dark:text-slate-400">
            <a
              onClick={() => setModalType("privacy")}
              className="cursor-pointer hover:text-indigo-600"
            >
              Privacy Policy
            </a>

            <a
              onClick={() => setModalType("terms")}
              className="cursor-pointer hover:text-indigo-600"
            >
              Terms of Service
            </a>
            {/* <a href="#" className="hover:text-indigo-600">Twitter</a> */}
          </div>
        </footer>
      </div>

      {modalType && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-900 max-w-2xl w-full p-8 rounded-2xl shadow-xl overflow-y-auto max-h-[80vh]">
            <h2 className="text-2xl font-bold mb-4">
              {modalType === "privacy" ? "Privacy Policy" : "Terms of Service"}
            </h2>

            <div className="text-sm text-slate-600 dark:text-slate-400 space-y-4">
              {modalType === "privacy" ? (
                <>
                  <p>
                    We collect basic user data such as name, email, and uploaded
                    content.
                  </p>
                  <p>
                    Your data is used only to provide and improve our services.
                  </p>
                  <p>We do not sell your personal information.</p>
                </>
              ) : (
                <>
                  <p>You agree to use the platform responsibly and legally.</p>
                  <p>We are not liable for AI-generated inaccuracies.</p>
                  <p>Services may change without notice.</p>
                </>
              )}
            </div>

            <button
              onClick={() => setModalType(null)}
              className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Contact;
