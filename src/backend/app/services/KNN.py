from sklearn.neighbors import KNeighborsClassifier
from app.models import DataSet, Question
import numpy as np

class KNN:
    def __init__(self, sample_answers, dataset_list, strand_list, dataset_id):
        self.sample_answers = np.array(sample_answers).reshape(1, -1)
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

        
        results = self.predict(knn, k, self.sample_answers)
        return results

    def calculate_distance(self, knn, sample_vector):
        distances, indices = knn.kneighbors(sample_vector)
        return indices[0], distances[0]

    def predict(self, knn, k, sample_vector):
        indices, distances = self.calculate_distance(knn, sample_vector)

        total_stem, total_humss, total_abm = 0, 0, 0
        neighbors = []
        print("Nearest Neighbors:")
        print("Index\tStrand\tDistance")
        print("-------------------------")
        print(f"Sample Vector: {sample_vector.flatten().tolist()}")
        print("-------------------------")
        print(f"K: {k}")
        for i, idx in enumerate(indices):
            strand = self.strand_list[idx]
            dist = float(distances[i])

            neighbors.append({
                "neighbor_index": int(idx + 1),
                "strand": strand,
                "distance": dist,
            })

            if strand == "STEM":
                total_stem += 1
            elif strand == "HUMSS":
                total_humss += 1
            elif strand == "ABM":
                total_abm += 1
            else:
                print(f"⚠️ Unexpected strand at index {idx}: {strand}")
            
        strand_votes = {
            "stem_score": total_stem,
            "humss_score": total_humss,
            "abm_score": total_abm,
            "neighbors": neighbors,
            "k": k,
        }

        vote_score = [total_stem, total_humss, total_abm]

        if vote_score.count(max(vote_score)) > 1:
            strand_votes["tie"] = True
            strand_votes["tie_strands"] = {}
            recommendation = self.tie_breaker(
                strand_votes, [n["strand"] for n in neighbors],
                [n["distance"] for n in neighbors],
                max(vote_score)
            )
        else:
            strand_votes["tie"] = False
            strand_votes["tie_strands"] = None
            recommendation = max(
                ["stem_score", "humss_score", "abm_score"], key=strand_votes.get
            )

        strand_votes["recommendation"] = self.fix_recommendation(recommendation)
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