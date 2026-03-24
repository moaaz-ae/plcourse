---
id: sentences
title: 'What Counts as a Sentence?'
prerequisites: []
---

# Sentences in Logic

Logic studies arguments. Arguments are made of **sentences**: statements that can be **true** or **false**.

| Expression          | Sentence? | Why?                          |
| ------------------- | --------- | ----------------------------- |
| "Mars is a planet." | Yes       | Can be true or false          |
| "Close the door!"   | No        | A command: not true or false  |
| "Is it raining?"    | No        | A question: not true or false |

A sentence does not need to be _actually_ true. "The Earth has two moons" is false, but it _could_ be true or false, so it counts as a sentence.

---

## Worked Example: Is it a sentence?

**Expression:** "Sarah passed the driving test."

1. Ask: is this a statement that claims something about the world?
2. Yes: it claims a person passed a test.
3. Ask: can this claim be true or false?
4. Yes: it is either true or false that she passed.
5. **Verdict: sentence.**

---

**Expression:** "Are you sleepy yet?"

1. Ask: is this a statement that claims something about the world?
2. No: it requests information. It is a question.
3. Questions are not true or false.
4. **Verdict: not a sentence.**

---

:::problem{tags="is-sentence"}
:::

---

# Truth Values

Every sentence has exactly one **truth value**: it is either **True (T)** or **False (F)**.

This holds even when:

- **We don't know the answer:** "There is life on Europa" is still true or false; we just don't know which.
- **It is an opinion:** "Rhubarb is tasty" counts as a sentence. It makes a claim that can be true or false.

The key rule: if the expression _could_ be true or false, it is a sentence and has a truth value.

---

## Worked Example: Assigning Truth Values

**Context:** It is July 20, 1969. Neil Armstrong has just stepped onto the Moon.

**Statement:** "A human has walked on the Moon."

1. Check: is this a sentence? Yes: it declares a fact about the world.
2. According to our context, Armstrong has just stepped onto the Moon.
3. The statement matches the facts of the context.
4. **Truth value: True.**

---

**Context:** It is July 20, 1969. Neil Armstrong has just stepped onto the Moon.

**Statement:** "No human has ever left Earth."

1. Check: is this a sentence? Yes: it makes a claim about human history.
2. According to our context, Armstrong is standing on the Moon, so a human _has_ left Earth.
3. The statement contradicts the facts of the context.
4. **Truth value: False.**

---

:::problem{tags="assign-truth"}
:::

---

# Why Expressions Fail

Not every English expression is a sentence. There are three common types that fail:

| Type            | Example            | Why it fails                                     |
| --------------- | ------------------ | ------------------------------------------------ |
| **Question**    | "What time is it?" | Requests information; not true or false          |
| **Command**     | "Sit up straight." | Tells someone to do something; not true or false |
| **Exclamation** | "Ouch!"            | Expresses a feeling; not true or false           |

Be careful with edge cases:

- "You will respect my authority" _looks_ like a command, but it is a prediction: either you will or you will not. **Sentence.**
- "I hurt my toe!" may sound like an exclamation, but it claims something factual. **Sentence.**

---

## Worked Example: Explaining Why an Expression Fails

**Expression:** "Go to the store."

1. Identify the type: this tells someone to do something. It is a **command**.
2. A command is not true or false: you can obey it or ignore it, but neither makes the command itself true or false.
3. Because it cannot be true or false, it is **not a sentence**.
4. **Reason: it is a command, not a declarative statement.**

---

:::problem{tags="why-fails"}
:::

---

# Bivalence and Paradoxes

Logic assumes **bivalence**: every sentence gets exactly one truth value, True or False. Not both. Not neither.

Some expressions _look_ like sentences but violate bivalence. These are **paradoxes**:

> "This sentence is false."

If it is **True**, then what it says must hold, so it is false. But if it is **False**, then "this sentence is false" is wrong, so it must be true. It flips between True and False with no way to settle.

Because this expression cannot settle on a single truth value, it violates bivalence and is **not a sentence** in logic.

---

## Worked Example: Testing for a Paradox

**Expression:** "This sentence is false."

1. **Assume it is True.** Then its content holds: it really is false. Contradiction: it cannot be both True and False.
2. **Assume it is False.** Then "this sentence is false" is wrong, meaning the sentence is True. Contradiction again.
3. No consistent truth value can be assigned.
4. **Verdict: paradox. Violates bivalence. Not a sentence in logic.**

---

:::problem{tags="paradox"}
:::
