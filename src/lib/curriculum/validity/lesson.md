---
id: validity
title: 'Validity & Counterexamples'
prerequisites:
  - id: arguments
    weight: 0.5
  - id: sentences
    weight: 0.1
---

# Valid Arguments

An argument is **valid** when it is impossible for all the premises to be true and the conclusion false at the same time.

Validity is not about whether the premises _are_ true. It is about whether the conclusion _must_ be true _if_ the premises are true.

Consider: "All humans need water. Sarah is a human. So, Sarah needs water." If both premises are true, the conclusion has to be true. This argument is valid.

---

## Worked Example: Is the argument valid?

**Argument:**

1. Either the butler or the gardener did it.
2. The butler didn't do it.
3. $\therefore$ The gardener did it.

**Steps:**

1. Ask: is there any possible situation where both premises are true but the conclusion is false?
2. If Premise 1 is true, at least one of them did it.
3. If Premise 2 is true, the butler is ruled out.
4. The only option left is the gardener. The conclusion must be true.
5. No possible situation makes the premises true and the conclusion false.
6. **Verdict: valid.**

---

**Argument:**

1. If the driver did it, the maid didn't do it.
2. The maid didn't do it.
3. $\therefore$ The driver did it.

**Steps:**

1. Ask: is there any possible situation where both premises are true but the conclusion is false?
2. Imagine a scenario: neither the driver nor the maid did it (a third person did).
3. Premise 1 is true: the driver didn't do it, so the "if" condition doesn't trigger. The premise holds regardless.
4. Premise 2 is true: the maid didn't do it.
5. But the conclusion is false: the driver didn't do it.
6. Both premises are true and the conclusion is false.
7. **Verdict: invalid.**

---

:::problem{tags="valid-or-invalid"}
:::

---

# Counterexamples

An argument is **invalid** when there exists at least one possible situation (called a **counterexample**) in which all premises are true and the conclusion is false.

To prove an argument is invalid, you only need _one_ counterexample. To prove an argument is valid, you must show that _no_ counterexample exists: no matter what scenario you imagine, if the premises are true, the conclusion is true too.

---

## Worked Example: Constructing a Counterexample

**Argument:**

1. If it rains, the streets get wet.
2. The streets are wet.
3. $\therefore$ It rained.

**Steps:**

1. To show this is invalid, find a scenario where both premises are true but the conclusion is false.
2. Scenario: a street-cleaning truck sprayed the streets. It did not rain.
3. Check Premise 1: "If it rains, the streets get wet." It did not rain, so this "if...then" statement is not violated. Premise 1 is true.
4. Check Premise 2: "The streets are wet." Yes, the truck sprayed them. Premise 2 is true.
5. Check the conclusion: "It rained." False: it did not rain.
6. All premises true, conclusion false. This scenario is a counterexample.
7. **Verdict: invalid.** The counterexample is: the streets are wet because of a street-cleaning truck, not rain.

---

**Argument:**

1. All dogs are mammals.
2. Rover is a dog.
3. $\therefore$ Rover is a mammal.

**Steps:**

1. To show this is invalid, we need a scenario where both premises are true and the conclusion is false.
2. That would require Rover to be a dog, all dogs to be mammals, yet Rover not to be a mammal.
3. But if Rover is a dog and all dogs are mammals, then Rover must be a mammal. There is no way around it.
4. No counterexample exists.
5. **Verdict: valid.**

---

:::problem{tags="counterexample"}
:::

---

# Validity Does Not Mean Truth

Two mistakes trip up most beginners:

**Mistake 1: "Valid means the conclusion is true."** A valid argument can have a false conclusion.

1. All fish live on land.
2. Sharks are fish.
3. $\therefore$ Sharks live on land.

This is valid: _if_ both premises were true, the conclusion would have to follow. Premise 1 is false in reality, but the logic still holds.

**Mistake 2: "Invalid means the conclusion is false."** An invalid argument can have a true conclusion.

1. The Sun is a star.
2. Water is wet.
3. $\therefore$ Tokyo is in Japan.

All three sentences happen to be true, but the conclusion has nothing to do with the premises. We can easily imagine a scenario where the premises are true and Tokyo is not in Japan (suppose Japan renamed its capital). So the argument is invalid.

The rule: validity is about the _connection_ between premises and conclusion, not about whether any individual sentence is true or false. An argument can be:

|             | True conclusion                                                | False conclusion                             |
| ----------- | -------------------------------------------------------------- | -------------------------------------------- |
| **Valid**   | The ideal case                                                 | At least one premise must be false           |
| **Invalid** | Conclusion happens to be true, but not because of the premises | Premises don't help, and conclusion is wrong |

Calling an argument invalid does not say the conclusion is wrong. It says the premises fail to _guarantee_ it.

---

## Worked Example: False Conclusion, Valid Argument

**Argument:**

1. All birds can fly.
2. Penguins are birds.
3. $\therefore$ Penguins can fly.

**Question:** The conclusion is false. Is the argument valid or invalid?

1. Validity asks: if the premises were all true, would the conclusion have to be true?
2. Suppose Premise 1 is true (all birds can fly) and Premise 2 is true (penguins are birds).
3. Then penguins fall under "all birds," so they can fly. The conclusion follows.
4. The argument is **valid**.
5. It has a false conclusion because Premise 1 is false. But that does not affect validity.

---

## Worked Example: Invalid Argument, True Conclusion

**Argument:**

1. Some cats are black.
2. $\therefore$ The Earth orbits the Sun.

**Question:** The conclusion is true. Is the argument valid or invalid?

1. Ask: is there a possible scenario where the premise is true and the conclusion false?
2. Imagine a universe where some cats are black but the Earth does not orbit the Sun (perhaps it orbits a different star).
3. The premise is true and the conclusion is false in that scenario.
4. This is a counterexample.
5. **Verdict: invalid.** The conclusion happens to be true in reality, but it does not follow from the premise.

---

:::problem{tags="validity-vs-truth,invalid-vs-false"}
:::
