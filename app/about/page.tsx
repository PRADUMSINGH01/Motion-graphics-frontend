import React from "react";
import Link from "next/link";
import NotebookShell from "../components/landing/NotebookShell";

export const metadata = {
  title: "About · byreel.in",
  description: "byreel turns a written description into a finished motion graphics video: what it does, how it works and how to reach us.",
};

const STEPS = [
  {
    title: "It reads what you asked for",
    body: "The words you want on screen, the frame, the length and the feel. Nothing you didn't write is put on screen as fact.",
  },
  {
    title: "It plans timed scenes",
    body: "A short storyboard: what each scene shows, how long it holds and how it moves to the next.",
  },
  {
    title: "It animates and checks each scene",
    body: "Every scene is written as an animated page with HyperFrames, checked for layout, contrast and timing, then rendered to a 1080p MP4.",
  },
];

export default function AboutPage() {
  return (
    <NotebookShell ariaLabel="About byreel">
      <article className="mx-auto w-full max-w-3xl space-y-10 px-4 py-6 text-[#07142e] sm:px-6 sm:py-10">
        <header className="space-y-3 border-b border-[rgba(7,20,46,0.18)] pb-6">
          <h1 className="m-0 text-3xl font-extrabold tracking-tight sm:text-4xl">About byreel</h1>
          <p className="m-0 text-[15px] leading-relaxed text-[rgba(7,20,46,0.78)]">
            byreel makes motion graphics from a description. Write what you want to see, like a launch teaser, a
            kinetic quote or an animated chart, and byreel plans it, animates it and hands you a video you can post.
            Then ask for changes in plain words.
          </p>
        </header>

        <section className="space-y-4" aria-labelledby="about-how">
          <h2 id="about-how" className="m-0 text-xl font-bold">
            How a video is made
          </h2>
          <ol className="m-0 grid list-none gap-3 p-0 sm:grid-cols-3">
            {STEPS.map((s, i) => (
              <li key={s.title} className="rounded-2xl border border-[rgba(7,20,46,0.14)] bg-white/70 p-4">
                <span className="text-[12px] font-semibold text-[rgba(7,20,46,0.55)]">{i + 1}</span>
                <h3 className="mt-1 text-[14.5px] font-semibold">{s.title}</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-[rgba(7,20,46,0.75)]">{s.body}</p>
              </li>
            ))}
          </ol>
          <p className="m-0 text-[13.5px] leading-relaxed text-[rgba(7,20,46,0.75)]">
            The planning and animation are written by large language models you can choose in the Studio, from
            providers such as Zhipu (GLM), DeepSeek, Anthropic, OpenAI and Google. Your request is sent to the model you
            pick so it can make your video.
          </p>
        </section>

        <section className="space-y-3" aria-labelledby="about-yours">
          <h2 id="about-yours" className="m-0 text-xl font-bold">
            Your videos are yours
          </h2>
          <p className="m-0 text-[13.5px] leading-relaxed text-[rgba(7,20,46,0.75)]">
            You can use what you make commercially, as set out in the{" "}
            <Link href="/terms" className="underline underline-offset-2">
              Terms
            </Link>
            . byreel doesn&apos;t train AI models, and we don&apos;t sell your prompts or videos. The{" "}
            <Link href="/policy" className="underline underline-offset-2">
              Privacy Policy
            </Link>{" "}
            explains what we keep and why.
          </p>
        </section>

        <section className="space-y-3 border-t border-[rgba(7,20,46,0.18)] pt-6" aria-labelledby="about-contact">
          <h2 id="about-contact" className="m-0 text-xl font-bold">
            Get in touch
          </h2>
          <p className="m-0 text-[13.5px] leading-relaxed text-[rgba(7,20,46,0.75)]">
            Questions, a bug, or a video that didn&apos;t come out right: write to{" "}
            <a href="mailto:support@byreel.in" className="underline underline-offset-2">
              support@byreel.in
            </a>
            .
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <Link href="/register" className="rounded-xl bg-[#07142e] px-4 py-2.5 text-[13px] font-semibold text-white">
              Make your first video
            </Link>
            <Link href="/pricing" className="rounded-xl border border-[rgba(7,20,46,0.2)] px-4 py-2.5 text-[13px] font-semibold">
              See pricing
            </Link>
          </div>
        </section>
      </article>
    </NotebookShell>
  );
}
