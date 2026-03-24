---
id: vagueness
title: 'Vagueness & Ambiguity'
prerequisites:
  - id: sentences
    weight: 0.2
---

# Vagueness

A word is **vague** when it lacks a sharp boundary. There are clear cases where it applies, clear cases where it does not, and a gray area in between where no definite answer exists.

| Word     | Clearly applies          | Clearly does not apply | Borderline case          |
| -------- | ------------------------ | ---------------------- | ------------------------ |
| **tall** | A person who is 2.1 m    | A person who is 1.5 m  | A person who is 1.75 m\* |
| **rich** | Someone with $10 billion | Someone with $100      | Someone with $200,000    |
| **old**  | A person who is 95       | A person who is 5      | A person who is 45       |

\* _(I am 1.75 m. This is why I prefer math to English.)_

In the borderline cases, there is no fact of the matter about whether the word applies. "A person who is 1.75 m is tall" cannot be assigned a clean truth value.

---

## Worked Example: Identifying Vagueness

**Sentence:** "The soup is hot."

1. Identify the potentially vague word: "hot."
2. Clear case where it applies: soup at 95 degrees Celsius is clearly hot.
3. Clear case where it does not apply: soup at 5 degrees Celsius is clearly not hot.
4. Borderline case: soup at 40 degrees Celsius. Is it hot? Warm? Not hot? There is no sharp boundary.
5. **Verdict: "hot" is vague.** In borderline cases, "The soup is hot" cannot be assigned a definite truth value.

---

**Sentence:** "The number 8 is even."

1. Is "even" vague? No: a number is even if it is divisible by 2 with no remainder. There are no borderline cases.
2. 8 divided by 2 is 4, with no remainder. It is even.
3. **Verdict: not vague.** "Even" has a sharp boundary; every integer is clearly even or clearly not even.

---

:::problem{tags="identify-vagueness"}
:::

---

# Ambiguity

A sentence is **ambiguous** when it has more than one distinct meaning. Unlike vagueness (which blurs the boundary), ambiguity gives you two or more **precise readings** with no way to tell which was intended.

There are two types:

- **Lexical ambiguity:** a single word has multiple meanings. "I went to the bank" could refer to a river bank or a financial institution.
- **Structural ambiguity:** the sentence structure allows multiple readings. "Flying planes can be dangerous" could mean the act of flying is dangerous, or that planes currently in flight are dangerous.

---

## Worked Example: Lexical vs. Structural Ambiguity

**Sentence:** "She saw the bat."

1. Is there a word with multiple meanings? Yes: "bat" can mean a flying mammal or a piece of sports equipment.
2. The sentence has two distinct readings: she saw an animal, or she saw a piece of equipment.
3. **Type: lexical ambiguity.** The word "bat" has two unrelated meanings.

---

**Sentence:** "Visiting relatives can be boring."

1. Does the sentence have multiple structural readings?
2. Reading 1: the act of visiting relatives is boring.
3. Reading 2: relatives who are visiting (i.e., who came to visit you) are boring.
4. The ambiguity arises from the structure: "visiting" can be a gerund (the act of visiting) or an adjective (relatives who are visiting).
5. **Type: structural ambiguity.** The sentence structure, not a single word, creates the double meaning.

---

:::problem{tags="classify-ambiguity"}
:::

---

# Disambiguating Ambiguous Sentences

To resolve ambiguity, rewrite the sentence into two (or more) unambiguous versions, one for each reading.

**Rule:** Each rewrite should have exactly one meaning with no possible confusion.

---

## Worked Example: Rewriting Ambiguous Sentences

**Ambiguous sentence:** "I saw her duck."

1. Reading 1: I saw her pet duck (a bird).
2. Reading 2: I saw her duck down (crouch to avoid something).
3. **Rewrite for Reading 1:** "I saw the duck that belongs to her."
4. **Rewrite for Reading 2:** "I saw her crouch down."

---

**Ambiguous sentence:** "The chicken is ready to eat."

1. Reading 1: the chicken (the food) is ready to be eaten.
2. Reading 2: the chicken (the animal) is ready to eat its food.
3. **Rewrite for Reading 1:** "The chicken is ready to be eaten."
4. **Rewrite for Reading 2:** "The chicken is ready to eat its food."

---

:::problem{tags="rewrite-ambiguous"}
:::

---

# Why Vagueness Matters for Logic

Logic requires every sentence to have a definite truth value: true or false. A vague sentence in a borderline case has no definite truth value, so it **cannot be used directly** in formal logic.

- A **clear sentence** has a definite truth value and works in formal logic.
- An **ambiguous sentence** can be rewritten so that each reading has a definite truth value.
- A **vague sentence in a borderline case** has no definite truth value. No amount of rewriting can create a sharp boundary.

Ambiguity is fixable: rewrite the sentence to pick one reading, and it becomes clear. Vagueness is harder: there is no fact of the matter, so no rewrite can resolve the borderline case.

---

## Worked Example: Does the Sentence Have a Definite Truth Value?

**Sentence:** "Alex is young."

1. Is "young" vague? Yes: there are clear cases (a 3-year-old is young), clear non-cases (a 90-year-old is not young), and borderline cases (a 35-year-old).
2. Suppose Alex is 35. Is Alex young? There is no definite answer.
3. We cannot assign "true" or "false" to "Alex is young" without drawing an arbitrary line.
4. **The sentence cannot be used in formal logic** because vagueness prevents a definite truth-value assignment in the borderline case.

---

**Sentence:** "I went to the bank."

1. Is this sentence vague or ambiguous? Ambiguous: "bank" has two distinct meanings.
2. Can it get a definite truth value? Yes, after disambiguation.
3. Pick one meaning: "I went to the financial institution." This has a clear truth value.
4. **The sentence works in formal logic after rewriting.** Ambiguity is resolved by choosing a specific reading.

---

:::problem{tags="why-no-symbolize"}
:::
