# anomaly-detection
project transaction anomaly

How the risk levels work: each transaction gets a z-score, which measures how far its amount is from the average in standard deviations.
​
Low Risk: z < 0
Medium Risk: 0 ≤ z < 0.5
High Risk: z ≥ 0.5
The cutoffs are computed from data set. The page checks how many of the transactions labelled as fraud fall into each level.
