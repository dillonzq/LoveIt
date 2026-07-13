---
title: "Sequential Recommender Systems Walk-Through"
description: "Walkthrough of sequential recommender systems from collaborative filtering through deep learning to LLMs, with detailed comparisons."
summary: "By modeling the same example, compare the difference of all SRS related methods"
date: 2025-08-10T16:27:22+02:00
lastmod: 2025-08-10T16:27:22+02:00
draft: false
weight: 50
categories: ["machine-learning", "recommendation-systems"]
tags: ["sequential-recommendation", "collaborative-filtering", "deep-learning"]
contributors: []
pinned: false
homepage: false
image: "" # Add header image path here (e.g., /images/blog/sequential-recommender-systems/header.jpg)
params:
  seo:
    title: "" # custom title (optional)
    description: "" # custom description (recommended)
    canonical: "" # custom canonical URL (optional)
    robots: "" # custom robot tags (optional)
---

### Introduction
I am blessed to have a cat baby, and I enjoy baking a lot, however recently I started to lose weight. So my amazon records looks like this:
- Months 1–6: lots of cat stuff (litter mat, fountain, scratching post, treats, toys, carrier).
- Months 7–9: baking accessories (sheet pans, silicone mats, piping bags, cake turntable, mixer bowl).
- Last 2 weeks: workout kick (Theragun → whey protein → lifting gloves).

Apparently my purchases have sequential dependencies, which are unable to be captured by conventional recommendation systems, including collaborative filtering and content-based filtering, as they model/depict consumers by their interaction to the items and it's order-agnostic and it's also just pair-wise correlation between the consumer and items based on engagements (clicks, conversions etc).

And to model such sequential dependencies, there are a lot of different models from non-DNN, DNN, to latest LLM. This doc summarizes how each model works for my user behaviors. For difficulties/challenges/characteristics of sequential recommender, please refer to [Sequential Recommender Systems: Challenges, Progress and Prospects](https://arxiv.org/pdf/2001.04830) 

### Collaborative Filtering - Matrix-factorization CF
Matrix-Factorization CF learns a latent vector p_u for each user. Although it's not frequency by category, but in practice, p_u ends up to be a function that normalizes the user factor by engagement with confidence scores.

The key components are:
* |I| is the size of items; k is item factor dimensions.
* Q: Item factor matrix, where each row is a k-dimensional vector for an item
* C_u: A diagonal confidence matrix of user u for items, where c_ui is the confidence score of user u with item i, normally derived from engagement data (clicks, conversions)

The confidence score is typically defined as:
```
c_ui = 1 + α * r_ui
```

Where r_ui is the interaction metric (clicks, conversions).

The normalization term ensures that the learned consumer representations are weighted by engagement (clicks/conversions) on item vectors. In the example, the user representation will be closest to cat supplies embeddings, so predictions will likely favor cat supplies. 

### Before DNN - Sequential pattern mining
Mine frequent patterns on sequence data, and then utilize the patterns for subsequent recommendations. Although simple and straightforward, but the patterns could be redundant. e.g. I am buying cat supplies monthly, while sometimes buying bake supplies in between. The pattern could be something like `cat_food` -> `cat_litter` -> `baking_supplies`. 

### Basic Markov Chain
The hypothesis is that future purchases depend only on the previous k purchases. A transition matrix is learned where each value represents how often transitions occur from state i to state j, with row normalization (each row sum = 1).

**Key concepts:**
- **First order chain:** Computes P(x_{t+1}=j | x_t = i)
- **High order chain:** Computes P(x_{t+1}=j | x_t, x_{t-1}, ..., x_{t-k})
  - For high order chains, the predicted probability is: P(X,T) = P(x_1, ...x_k) × ∏_{t=k+1}^T P(x_t | x_{t-1}...x_{t-k})

**Transition matrix:**
The transaction matrix is computed as: T_ij = #(i → j) / ∑_{j'} #(i → j')

Since the last item is lifting glove, the prediction will be whichever item has the largest probability in the lifting glove row of the transition matrix. 

### Latent Markov Embedding based approach




# Deep Learning Era
## RNN-based approaches
Recurrent Neural Networks can capture longer-term dependencies in sequential data, making them more suitable for modeling complex user behavior patterns.

## Attention-based models
Modern attention mechanisms can focus on relevant parts of the purchase history when making recommendations.

# LLM Wave
## Large Language Models for recommendation
Recent advances in LLMs show promise for understanding complex user preferences and generating personalized recommendations based on natural language descriptions of user behavior.

# Conclusion
Sequential recommendation systems offer a more nuanced understanding of user behavior by considering the temporal order of interactions. While traditional methods focus on static user-item relationships, sequential models can capture evolving preferences and behavioral patterns over time.
