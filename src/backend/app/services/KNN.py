from sklearn.neighbors import KNeighborsClassifier
from app.models import DataSet, Question


class KNN:
    def __init__(self, sample_answers, dataset_list, strand_list, dataset_id):
        # sample_answers is ALREADY a processed vector like [[2, 5, 7]]
        self.sample_answers = sample_answers
        self.dataset_list = dataset_list
        self.strand_list = strand_list
        self.dataset_id = dataset_id

    def start_algorithm(self):
        dataset = DataSet.query.get(self.dataset_id)
        if not dataset:
            raise ValueError(f"Dataset with id {self.dataset_id} not found.")

        k = dataset.best_k
        knn = KNeighborsClassifier(n_neighbors=k)
        knn.fit(self.dataset_list, self.strand_list)

        # ✅ use self.sample_answers directly
        results = self.predict(knn, k, self.sample_answers)
        return results

    def calculate_distance(self, knn, sample_vector):
        distances, indices = knn.kneighbors(sample_vector)
        return indices[0], distances[0]

    def predict(self, knn, k, sample_vector):
        indices, distances = self.calculate_distance(knn, sample_vector)
        nearest_neighbors = [self.strand_list[i] for i in indices]

        # Count votes
        total_stem = nearest_neighbors.count("STEM")
        total_humss = nearest_neighbors.count("HUMSS")
        total_abm = nearest_neighbors.count("ABM")
        strand_votes = {
            "stem_score": total_stem,
            "humss_score": total_humss,
            "abm_score": total_abm,
        }

        vote_score = [total_stem, total_humss, total_abm]

        if vote_score.count(max(vote_score)) > 1:
            strand_votes["tie"] = True
            strand_votes["tie_strands"] = {}
            recommendation = self.tie_breaker(
                strand_votes, nearest_neighbors, distances, max(vote_score)
            )
        else:
            strand_votes["tie"] = False
            strand_votes["tie_strands"] = None
            recommendation = max(
                ["stem_score", "humss_score", "abm_score"], key=strand_votes.get
            )

        fixed_recommendation = self.fix_recommendation(recommendation)
        strand_votes["recommendation"] = fixed_recommendation

        # Add neighbors info
        strand_votes["neighbors"] = []
        strand_votes["k"] = k
        for i, idx in enumerate(indices):
            strand_votes["neighbors"].append({
                "neighbor_index": int(idx + 1),
                "strand": nearest_neighbors[i],
                "distance": float(distances[i]),
            })

        return strand_votes

    def tie_breaker(self, strand_votes, nearest_neighbors, distances, tie_score):
        tied_strands = {}
        for key, value in strand_votes.items():
            if value == tie_score and key in ["stem_score", "humss_score", "abm_score"]:
                tied_strands[key.replace("score", "weight")] = 0

        for i, strand in enumerate(nearest_neighbors):
            weight = float(1 / distances[i]) if distances[i] != 0 else 1.0
            if strand == "STEM" and "stem_weight" in tied_strands:
                tied_strands["stem_weight"] += weight
            elif strand == "HUMSS" and "humss_weight" in tied_strands:
                tied_strands["humss_weight"] += weight
            elif strand == "ABM" and "abm_weight" in tied_strands:
                tied_strands["abm_weight"] += weight

        recommendation = max(tied_strands, key=tied_strands.get)
        if recommendation == "stem_weight":
            recommendation = "stem_score"
        elif recommendation == "humss_weight":
            recommendation = "humss_score"
        elif recommendation == "abm_weight":
            recommendation = "abm_score"

        strand_votes["tie"] = True
        strand_votes["tie_strands"] = tied_strands
        return recommendation

    def fix_recommendation(self, recommendation):
        if recommendation in ["stem_weight", "stem_score"]:
            return "STEM"
        elif recommendation in ["humss_weight", "humss_score"]:
            return "HUMSS"
        elif recommendation in ["abm_weight", "abm_score"]:
            return "ABM"