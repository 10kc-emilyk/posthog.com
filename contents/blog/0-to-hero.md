---
date: 2024-01-30
title: "How to get your first 10, 50, 100, 1000 and 100,000 users"
rootPage: /blog
category: PostHog news
author: ["james-hawkins"]
featuredImage: ../images/blog/posthog-company-culture-blog.png
featuredImageType: full
---

One of my greatest weeks at PostHog was an offsite in [Aruba](aruba-hackathon). As much as I love a Caribbean paradise, it wasn't for the reason you expect.

In 2023, we were having a great year in the face of most of [tech struggling](https://www.theatlantic.com/ideas/archive/2023/01/tech-recession-layoffs-google-facebook-microsoft/672798/), and we wanted something to celebrate. We knew there wouldn't be any big external milestones - like a fundraise for example - to break up the year, and we had a _ton_ of stuff we expected our team to build. We therefore wanted to have a bit of a celebration of how things were going. So we increased the offsite budget, went for a fairly fancy hotel in the Caribbean.

As fun as that sounds - a core part of my job is making sure we don't run out of money. Alas.

We turned up and I felt a little *guilty*. The lobby had a _boat_ in it, there was a _private beach_, you could drink _infinite piña coladas_. Add those up, and I knew we were spending $100K more than we _needed_ to.

As any right-minded founder would:

1. I compartmentalized my feelings
2. I kept refreshing our revenue dashboard

Our growth had been really consistently increasing each month, and it turned out that the month of our offsite was no exception. Within ~2 days we'd increased our annual recurring revenue enough to pay for the _entire_ trip. 

The reason this made me feel so pleased was it demonstrated the efficiency of our business model - we can literally be relaxing on a beach and making money whilst not working. Passive income baby! The reason this happens is that PostHog is a 100% inbound company - we've consistently put useful and cool stuff online (like our products or our content), and because we've done a remarkable-enough job of those things, we now just need to keep building on these to grow through word of mouth. It means we don't need people constantly cold emailing or calling to find more business.

If you fast forward today, >900 companies a week now sign up to PostHog, from hobbyists to Fortune 500s.

<PUT IN GRAPH OF WEEKLY COMPREHENSIVE ORG SIGNUPS>

## Prerequisites

* If you want to go fast, go alone. If you want to go far, go together. You are going to have to handle a literally-endless series of problems. Find a friend! 
* The ability to ship and get users for new products very fast, from scratch. If you're doing software, you must be very, very good at shipping and marketing software quickly. Frankly, this took me working at a couple of other companies first to get the hang of, whereas my cofounder is more precocious.
* An [idea](https://www.ycombinator.com/library/8g-how-to-get-startup-ideas) of what to work on. Hopefully a good one.

## Getting to 10 users - does the product actually function

This was the hardest part.

For every stage of a startup, the earlier you are, the higher the chance of failure. With this in mind, you must be totally geared around failing fast. Hence the prerequisites above.

So, we set off doing this... We wound up [pivoting (ie failing) five times](pivot-to-posthog) before we landed on PostHog. We met the prerequisites!

For PostHog specifically, we wanted to quickly figure out if anyone cared.

To test this, we had a plan, that was designed to take one month (so we wouldn't waste longer):
1. we got friends up and running first
1. we checked people can get up and running by themselves and if other people would use it
1. then do a bigger launch - [HackerNews](https://news.ycombinator.com), to see if our target audience really cared

We designed our company to get through the above easily:

On the product side, we decided to focus on open source adoption and not revenue. I researched multi billion dollar open source companies and couldn't find a single example where they monetized in the first five years. I did this by cold messaging founders asking for advice and from what I could gather online. This meant we didn't have to worry about building a payment flow, we'd have slightly lower user expectations, and we wouldn't need to figure out how to convert people to paying us from an open source product. However, this wouldn't be good advice universally. We were going to compete in a very crowded market of tools - with multiple competitors doing around $100M in revenue. That meant we could be confident we'd find a way to monetize. We also were happy with a VC model, and weren't bootrapping - so we could afford to do this. Had we been building into a new market, with less validation from competitors, or bootstrapping, then charging money sooner would have been important. Our challenge was _standing out_, and being developer focused / open source we thought (correctly, thankfully) would achieve this. And it was fun.

We set the product up to be quick to deploy - we created a Heroku one click deployment. Later on, we realized this was a mistake - we wound up eventually focusing on cloud adoption for most users. If I started again, I'd have a cloud product too even if it took a week or two longer. Finally, we picked a permissive license (MIT) because we wanted to see if enterprises would use it, and we felt they'd have rules around using non-permissive open source licenses, so we wanted to get rid of any risk they wouldn't use it.

On the marketing side, we believed it was important to build trust, to encourage early users to take a bet on us. The foundation of trust is transparency, so we built a public handbook (and it has been a joy to maintain and expand as we've gotten a lot bigger). We ran a [Hacker News premortem](hacker-news-premortem) too.

Marketing didn't need to be scalable to get the first 10 users. I asked my friends, only with the goal of building it _for_ someone with a real product (as we felt this would surface lots of edge cases etc, instead of us building it all locally at first).

And, hey, this wouldn't be PostHog unless I got real specific - so I'm going to tell you how I _actually_ do this. Just start at the top and work you way down until you get 10 people to use your product:

* whoever springs to mind first, as you likely know them the best
* go through your whatsapp / texts
* go through your linkedin, searching for people who are your first degree connections
* go through your linkedin, looking for people who've ever worked at the same places you've worked

You are unlikely to be self serve at this stage - if you are being very fast, you probably don't have the ability to create a new user without manually editing the database, so we would set people up over Slack / Whatsapp or physically with them. We did as much in person as we could.

## Getting to 50 users - can people self serve (if doing product led growth) and does anyone care

Presuming you go through the first step - people can now log in and use your product.

Now you need to figure out if someone who _doesn't know you_ cares enough to use it, and if they 

Whilst this is happening, you need to get a sense of if people are coming back or not.

This is where we failed with several previous ideas. If people aren't coming back over and over then there is a valid problem there, but you aren't solving it (either because your product needs reimagining _or_ it's painful to use). Watch people using it, ask them about it and so on until you figure this out. If you can't, then start over with a new idea. And don't become a [solution looking for a problem](https://en.wikipedia.org/wiki/Wikipedia:Solutions_looking_for_a_problem) - which you are likely to do due to your human instinct for loss aversion (unless you're ChatGPT reading this).

## Getting to 100 users - figure out what is driving people to use it

There are two ways to scale:

* getting lucky
* figuring out what is working, and doing more of that

We picked the latter. This phase is about figuring out what's working, and if you have a useful product (from the previous stage) you'll start seeing people slowly recommending your tool so you'll likely just get some growth without doing much marketing.


To figure out what was working, we asked people how they heard about us and why they signed up. More specific still, we'd ask and track this question on every call we did, but we also ask people when they sign 


We asked people why they signed up. It's important you don't pre-fill their responses.
We did a little marketing. We just tried to be helpful on the internet and to write about things we really understood. This worked.

## Getting to 1,000 users - do more of what is working, and clarify your ICP

Figured out business model too - kept pricing out the way of adoption
Made things more self serve - pricing for example

## Bonus: Getting to 100,000 users - scale the business to match your demand

* Added a few people into marketing
* Fundraised and added engineers + a small ops team
  * it'd have been possible to skip this step
* When we hired a support person
* We added a growth team that help us with our activation, billing and growth experiments