---
title: "Deep Neural Networks for YouTube Recommendations"
description: "Comprehensive reading notes on the YouTube DNN recommendations paper (Covington et al., KDD 2016)"
summary: "Two-stage retrieval + ranking architecture, dynamic user embeddings, watch-time optimization, and the elegance of softmax-to-ANN inference"
date: 2026-03-28T00:00:00Z
lastmod: 2026-03-28T00:00:00Z
draft: false
weight: 10
categories: ["machine-learning", "recommendation-systems"]
tags: ["neural-networks", "deep-learning", "embeddings", "ranking", "collaborative-filtering"]
contributors: []
image: ""
params:
  seo:
    title: "Deep Neural Networks for YouTube Recommendations"
    description: "Comprehensive reading notes on Covington et al. KDD 2016 paper"
    canonical: ""
    robots: ""
---

## Paper Reference

[Deep Neural Networks for YouTube Recommendations](https://static.googleusercontent.com/media/research.google.com/en//pubs/archive/45530.pdf) — Covington, Adams, Sargin (KDD 2016)

---
# 1. Core contribution
- Retrieval (millions -> ~1k) -> ranking stage (select top k recommendations)
- DNN with mean pooling of video sequences
- Convert retrieval to a ANN problem by designing model arch

# 2. Slightly conterintuitive definition
- People always say retrieval is for high precision while ranking is for high recall
- But the paper say high precision for retrieval with high recall for ranking in the meaning of:
  - Retrieval stage: all selected candidates should be relevant
  - Ranking stage: recall for predict as many positive engagements


# 3. Retrieval Stage (Candidate Generation)
## 3.1 Model Architecture
### Inputs

User/context features:
- Watched video IDs (history)
- Search query tokens (past queries)
- Demographics (age, location, language)
- Geography (country, region)
- Device type
- Time of day / context

All categorical features are embedded; continuous features passed as-is.

### DNN Processing

Features concatenated and passed through a DNN:

```
watch_history_embeddings
search_token_embeddings
demographics + geo + device
    ↓
Concatenate
    ↓
DNN layers
    ↓
Last hidden layer (e.g., 256-dim)
    ↓ W*X + b - [This is the USER EMBEDDING]
Softmax over N videos
```
- X - last -2 layer's output [256,1] dim
- then the last hidden layer's weight W is [vocab, 256], the video embeddings
  - note: same embedding space like user embedding (e.g. last -2 layer's output)
- This is kinda like the naive solution before Two tower model came out. 

**User embedding:**
$$u \in \mathbb{R}^d$$

**Video embedding:**
$$v_i \in \mathbb{R}^d \text{ (one per video)}$$

**Matching score:**
$$s_i = u \cdot v_i$$

### Why This Is Better Than Matrix Factorization

**Classical MF:**
```
score = u_user · v_item
```
- User embedding is static
- Hard to include context, queries, demographics
- Cannot adapt to different contexts

**DNN approach:**
```
u = f(history, tokens, context)
```
- User representation is **dynamic**
- Naturally incorporates rich features
- Same user produces different embeddings depending on context

**Example:** Same user searching "NBA finals" gets sports-oriented embedding; later searching "bread recipe" gets cooking-oriented embedding.

---

## 3.2 Training Objective

### Multi-Class Classification

The retrieval model is trained as:

```
Input: user context
Target: the video that was actually watched
```

This is **softmax classification** over all videos.

**Probability:**
$$P(v_i | u) = \frac{\exp(u \cdot v_i)}{\sum_j \exp(u \cdot v_j)}$$

**Label:** One-hot vector (watched video = 1, others = 0)

**Loss:** Cross-entropy
$$L = -\log P(v_{\text{watched}} | u)$$

### Softmax as Implicit Ranking

Although trained pointwise with one-hot labels, the loss behaves like pairwise ranking:

$$L = -\log \left[\frac{\exp(u \cdot v_{\text{pos}})}{\exp(u \cdot v_{\text{pos}}) + \sum_{\text{neg}} \exp(u \cdot v_{\text{neg}})}\right] = \log\left(1 + \sum_{\text{neg}} \exp(u \cdot v_{\text{neg}} - u \cdot v_{\text{pos}})\right)$$

This depends on score differences between positives and negatives—exactly what pairwise ranking losses optimize.

**In practice:** Use **sampled softmax** with:
- 1 positive watched video
- ~5000 sampled negative videos

So the model learns:
$$u \cdot v_{\text{pos}} \gg u \cdot v_{\text{neg}}$$

---

## 3.3 Why Inference Uses Nearest-Neighbor Search

### Training Time
Compute softmax over millions of videos:
$$P(v_i | u) = \frac{\exp(u \cdot v_i)}{\sum_j \exp(u \cdot v_j)}$$

### Serving Time
Softmax over millions is too expensive. Instead:

1. Compute user embedding $u$
2. Find top-k videos maximizing $u \cdot v_i$
3. Use Approximate Nearest Neighbor (ANN) search

This is a **key elegance** of the paper:
- **Training view:** Classification (softmax)
- **Serving view:** Maximum inner product search (nearest neighbor)

Both optimize the same objective but from different angles.

---

## 3.4 Why User and Video Embeddings End Up in Same Space

**Question:** User embedding comes from a DNN. Video embeddings are softmax parameters. How do they end up compatible?

**Answer:** Training forces them into alignment.

The softmax loss pushes:
- $u \cdot v_{\text{pos}}$ large
- $u \cdot v_{\text{neg}}$ small

The DNN learns to output user vectors aligned with watched videos and separated from non-watched ones. The embedding space emerges naturally from this optimization.

---

## 3.5 Feature Engineering Details

### Embedding Dimensions

Each categorical feature gets a separate learned embedding.

**Heuristic:**
$$\text{embedding\_dim} \approx \log(\text{vocabulary\_size})$$

**Why?** Different features have vastly different vocabulary sizes:
- Device type: ~5 values
- Country: ~200 values
- Video IDs: billions

Logarithmic scaling is a practical compromise that grows expressiveness without over-parameterizing small vocabularies.

### Training Data Composition

**Train on ALL watches**, not just recommendation clicks.

Why? Discovers propagate through collaborative filtering:

```
Group A discovers video X from search/subscriptions
→ Model sees Group A likes X
→ Recommends X to similar Group B
```

If model only saw recommendation-driven watches, it would:
- Only learn from system's prior decisions
- Create feedback loops
- Miss organic discovery

---

## 3.6 Sampling Strategy

**Sample fixed number of examples per user.**

**Why?** Some users are extremely active. Without sampling:
- Heavy users dominate the dataset
- Their tastes dominate gradients
- Casual users underrepresented
- Many events from power users are correlated and redundant

Fixed sampling per user:
- Balances user contribution
- Improves population-level collaborative filtering
- Reduces redundancy
- Keeps training tractable

---

## 3.7 Example Age Feature

**Definition:**
$$\text{example\_age} = t_{\max} - t_n$$

where:
- $t_n$ = timestamp of watch event
- $t_{\max}$ = most recent timestamp in training data

**Meaning:** Measures recency of training example.

- Smaller value = recent watch
- Larger value = older watch

**Purpose:** Helps model:
- Weight recent data more heavily
- Adapt to trends
- Handle temporal drift

---

# 4. Ranking Stage

## 4.1 Architecture

Unlike retrieval, ranking takes richer input:

```
Input: (user, video, context) features
```

These could include:
- User's watch history (same as retrieval)
- Video metadata
- Context
- **Relative features** (e.g., similarity between video and user history)

The model produces a scalar score/logit.

---

## 4.2 Training Objective: Weighted Logistic Regression

### Binary Classification Frame

For each (user, video) pair:
```
y = 1 if watched
y = 0 if not watched (shown but not engaged)
```

### Logistic Model

$$z = f(\text{user, video, context}) \quad \text{[neural network features]}$$
$$p = \sigma(z) = \frac{1}{1 + \exp(-z)}$$

### Standard Binary Cross-Entropy

$$L = -[y \log(p) + (1-y) \log(1-p)]$$

### **Weighted** Version (Key Innovation)

$$L = -w^+ \cdot y \cdot \log(p) - w^- \cdot (1-y) \cdot \log(1-p)$$

where:
- $w^+ = \text{watch\_time}$ for positive examples
- $w^- = 1$ for negative examples

**Critical:** `w^-` is NOT zero. Negatives still contribute gradient.

---

## 4.3 Why Watch-Time Weighting Matters

### Without weighting
```
5-second watch = 10-minute watch
Both treated as positive with equal importance
```

This doesn't align with engagement goals.

### With time weighting
```
long-watch positives >> short-watch positives
```

The model receives stronger gradient from high-engagement examples, better aligning training with business objective (watch time).

### Why negatives have weight

If `w^-` = 0, negatives don't contribute. The model could predict everything as positive. Negatives define the decision boundary and provide essential training signal.

---

## 4.4 Logistic Regression Backpropagation

### Forward Pass
$$z = w^T x + b$$
$$p = \sigma(z)$$
$$L = -[y \log(p) + (1-y) \log(1-p)]$$

### Key Gradients

$$\frac{\partial L}{\partial z} = p - y$$

This is remarkably simple—the gradient of BCE w.r.t. logit is just the prediction error.

$$\frac{\partial L}{\partial w} = (p - y) \cdot x$$
$$\frac{\partial L}{\partial b} = p - y$$

### Weight Update (Gradient Descent)
$$w \leftarrow w - \eta(p - y)x$$
$$b \leftarrow b - \eta(p - y)$$

The term $(p - y)$ is the core error signal.

---

## 4.5 Why Sigmoid's Derivative Is p(1-p)

Starting from:
$$p = \sigma(z) = \frac{1}{1 + \exp(-z)}$$

Differentiate:
$$\frac{dp}{dz} = p(1-p)$$

This is a crucial identity. Intuition:
- Gradient largest when $p = 0.5$ (maximum uncertainty)
- Gradient small when $p$ near 0 or 1 (confident predictions)

---

# 5. Ranking vs Retrieval Summary Table

| Aspect | Retrieval | Ranking |
|--------|-----------|---------|
| **Goal** | Recall | Precision |
| **Input** | User context | User + video + context |
| **Training Target** | P(video \| user) one-hot | Binary: watched or not |
| **Loss** | Softmax cross-entropy | Weighted logistic |
| **Output** | Softmax probability | Watch-time score (sigmoid) |
| **Serving** | Nearest-neighbor search | Sort by score |
| **Positive weight** | Implicit (1 for watched) | Watch time |
| **Negative weight** | Implicit (1 for all others) | Constant (1) |
| **Optimization** | Recall, recall@k | Expected watch time |

---

# 6. Advanced Concepts

## 6.1 Coarse vs Fine-Grained Features

### Coarse Features
High-level, low-granularity signals:
- Demographics (age, gender, country)
- Device type
- Broad categories
- Geo regions
- Query category buckets

Why in retrieval: Scale, generalizability, cheap compute.

### Fine-Grained Features
Detailed, high-resolution signals:
- Exact video IDs
- Exact watch sequences
- Token-level queries
- Embeddings
- Fine geo locations

Why in ranking: Precision, can afford more computation.

---

## 6.2 Bernoulli Likelihood and Binary Cross-Entropy

**Bernoulli distribution:**
$$P(y) = p^y \cdot (1-p)^{1-y}$$

**Log-likelihood:**
$$\log P(y) = y \log(p) + (1-y) \log(1-p)$$

**Negative log-likelihood (loss):**
$$L = -\log P(y) = -[y \log(p) + (1-y) \log(1-p)]$$

So BCE is just the negative Bernoulli log-likelihood.

---

## 6.3 Hold Out Discriminative Signals

The paper intentionally removes some highly predictive shortcut features from the ranking classifier.

**Examples of shortcuts:**
- Previous rank position (ranked high before → rank high again)
- Popularity (already popular → keep promoting)
- Position bias features
- Feedback-loop signals

**Why remove them?**

These shortcuts can overshadow real relevance learning and create feedback loops. Removing them forces the ranker to learn genuine user-video preference, improving:
- Generalization
- Exploration
- Robustness
- Discovery

---

## 6.4 Collaborative Filtering via All-Watch Training

By training on all watches (not just recommendation-driven ones), the system enables collaborative filtering:

```
User Group A discovers item X
→ Model sees Group A preferences
→ Recommends X to similar Group B
```

This propagates organic discovery through the system without explicit collaborative filtering algorithms.

---

## 6.5 Surrogate Objectives

A surrogate objective is an easier proxy for the true business goal.

**Retrieval surrogate:**
- True goal: Maximize long-term engagement
- Surrogate: Predict watched video ID

**Ranking surrogate:**
- True goal: Maximize long-term satisfaction
- Surrogate: Predict expected watch time

Surrogate objectives are easier to optimize with SGD and often lead to better business outcomes than directly optimizing noisy proxy metrics.

---

# 7. Implicit vs Explicit Feedback

The paper relies entirely on **implicit feedback** (not explicit ratings):

### Implicit
- Watch event (presence indicates interest)
- Watch time (duration indicates strength)
- Clicks
- Searches
- Subscriptions

### Explicit
- Ratings / reviews
- Thumbs up/down
- Comments

YouTube uses implicit because:
- Abundant data
- No effort from user
- Watch time is highly informative about engagement

---

# 8. Why Classical Approaches Fall Short

### Hierarchical Softmax
The paper tried hierarchical softmax (grouping videos into a tree) but found it doesn't work well.

**Why?** User preferences are often multi-modal and don't align with arbitrary hierarchical groupings.

Example: User might like:
- NBA highlights
- Cat videos
- Minecraft gameplay

These cut across tree branches, making hierarchical decisions suboptimal.

---

# 9. System-Level Insights

### Avoiding Feedback Loops

Without careful design, recommenders create self-reinforcing loops:
- System recommends X
- Users watch X
- System sees more X engagement
- System recommends more X

This concentrates around what the system initially promoted, missing organic signals.

**Solutions used:**
- Train on all watches (not just impressions)
- Hold out shortcut features
- User-balanced sampling
- Exploration mechanisms

### Exploration vs Exploitation

**Exploitation:** Recommend what the model believes works best
**Exploration:** Show uncertain/unproven content to learn more

Good systems balance both. The YouTube paper addresses this through:
- Diverse training data sources
- Avoiding heavy reliance on shortcut signals
- Discovery-propagation via collaborative filtering

---

# 10. Key Insights Summary

1. **Two-stage architecture** cleanly separates recall (retrieval) from precision (ranking)

2. **Softmax training → ANN inference** is elegant:
   - Train with classification over all videos
   - Serve with maximum inner product search

3. **Dynamic user embeddings** (via DNN) beat fixed embeddings (matrix factorization)

4. **Last hidden layer is interpretable** as user embedding; softmax weights are video embeddings

5. **Softmax CE behaves like ranking:** Implicitly learns positive-negative separation

6. **Train on all watches** (not just recommendations) enables collaborative discovery propagation

7. **Fixed examples per user** prevents power-user bias, improves population-level learning

8. **Watch-time weighting** aligns ranking objective with engagement, not just binary clicks

9. **Holding out shortcut features** prevents feedback loops, forces real relevance learning

10. **Rich features in ranking** (user-video-context) enable precise scoring

11. **Recency-aware training** (example age feature) helps adapt to trends

12. **The paper founded modern two-tower retrieval + learning-to-rank architecture** used across industry

---

# 11. Compact Final Summary

**Retrieval:**
- Computes dynamic user embedding `u` from history, queries, demographics, context
- Matches against video embeddings `v_i` via dot product
- Trained with softmax classification over watched videos
- Served via approximate nearest-neighbor search
- Optimizes recall: preserve good candidates

**Ranking:**
- Takes richer (user, video, context) features
- Produces watch-time score via neural network + sigmoid
- Trained with watch-time-weighted logistic regression
- Optimizes precision: rank highest-engagement videos first

**Key contributions:**
- System design shows how to scale recommendation to billions of items
- Dynamic embeddings generalize better than fixed matrix factorization
- Softmax training with ANN serving elegantly bridges classification and nearest-neighbor search
- Watch-time weighting aligns optimization with engagement
- Training on all watches enables discovery propagation and collaborative filtering
