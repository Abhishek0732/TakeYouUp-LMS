const machineLearningCourse = {
  id: "ml-101",
  title: "Machine Learning Mastery",
  description:
    "Become a machine learning expert: from data preprocessing to building and deploying predictive models. Understand supervised / unsupervised / reinforcement learning, model evaluation, feature engineering, deep learning, and real‑world applications.",
  level: "Intermediate to Advanced",
  duration: "10 weeks",
  students: 800,
  rating: 4.9,
  image: "https://images.unsplash.com/photo-1518773553398-650c184e0bb3?w=1200&h=600&fit=crop",
  instructor: "Dr. Emma Smith",
  price: "$149",
  modules: [
    {
      title: "Fundamentals of Machine Learning",
      lessons: [
        {
          title: "What is Machine Learning?",
          duration: "30 min",
          content:
            "Understand what machine learning is, its real‑world importance, and the different paradigms (supervised, unsupervised, reinforcement).",
          keyPoints: [
            {
              point: "Definition & Paradigms",
              explanation:
                "Learn what machine learning means, how it differs from traditional programming, and what supervised, unsupervised, and reinforcement learning are."
            },
            {
              point: "Applications of ML",
              explanation:
                "Explore how ML is used in real life: recommendation systems, image recognition, fraud detection, NLP, etc."
            },
            {
              point: "Challenges in ML",
              explanation:
                "Understand challenges like overfitting, data bias, requirements for large datasets, and interpretability."
            }
          ]
        },
        {
          title: "Data Preprocessing & Feature Engineering",
          duration: "45 min",
          content:
            "Learn how to clean and prepare data, do feature engineering, scaling, encoding of categorical variables — all critical to building good models.",
          keyPoints: [
            {
              point: "Handling Missing Data & Outliers",
              explanation:
                "Strategies for handling missing values, outliers in datasets so models don't get skewed."
            },
            {
              point: "Feature Scaling & Normalization",
              explanation:
                "Learn why scaling features (standardization, min‑max) helps many algorithms converge faster and perform better."
            },
            {
              point: "Encoding Categorical Variables",
              explanation:
                "How to convert categorical data into numeric form (one‑hot, label encoding, target encoding) so ML models can use them."
            },
            {
              point: "Feature Creation & Selection",
              explanation:
                "How to generate new features, select relevant ones (using correlation, feature importance, regularization) to improve model accuracy."
            }
          ]
        }
      ]
    },
    {
      title: "Supervised Learning Algorithms",
      lessons: [
        {
          title: "Linear Regression",
          duration: "50 min",
          content:
            "Learn how linear regression models work for predicting continuous output. Understand loss functions, fitting methods, and evaluating regression performance.",
          keyPoints: [
            {
              point: "Least Squares & Cost Functions",
              explanation:
                "How loss (mean squared error or similar) is calculated and minimized in linear regression models."
            },
            {
              point: "Assumptions of Linear Regression",
              explanation:
                "Understand the assumptions like linearity, independence, homoscedasticity, and normality of residuals."
            },
            {
              point: "Polynomial & Multiple Regression",
              explanation:
                "Extending simple regression to multiple features or polynomial terms to model more complex relationships."
            },
            {
              point: "Overfitting & Regularization",
              explanation:
                "Learn about overfitting in regression and ways to prevent it (Ridge, Lasso regularization)."
            }
          ]
        },
        {
          title: "Classification Algorithms",
          duration: "60 min",
          content:
            "Explore algorithms for classification: logistic regression, decision trees, random forests, SVMs. Learn when to use which, and metrics for evaluation.",
          keyPoints: [
            {
              point: "Logistic Regression",
              explanation:
                "Used when the output is categorical. Learn the sigmoid function, decision boundary, loss (log loss) etc."
            },
            {
              point: "Decision Trees & Random Forest",
              explanation:
                "How decision trees split data and how random forests combine many trees for better performance and stability."
            },
            {
              point: "Support Vector Machines (SVM)",
              explanation:
                "Learn how SVM builds optimal hyperplanes for classification, kernel trick for non‑linear separation."
            },
            {
              point: "Evaluation Metrics for Classification",
              explanation:
                "Accuracy, precision, recall, F1‑score, confusion matrix, ROC curves – how to choose and interpret them."
            }
          ]
        }
      ]
    },
    {
      title: "Unsupervised Learning & Clustering",
      lessons: [
        {
          title: "Clustering Techniques",
          duration: "45 min",
          content:
            "Learn unsupervised methods like K‑Means, hierarchical clustering, DBSCAN, to find structure in unlabeled data.",
          keyPoints: [
            {
              point: "K‑Means Clustering",
              explanation:
                "How K‑Means algorithm partitions data into K clusters, centroid initialization, convergence etc."
            },
            {
              point: "Hierarchical Clustering",
              explanation:
                "Forming nested clusters; how to use dendrograms and decide on number of clusters."
            },
            {
              point: "Density-Based Clustering (DBSCAN)",
              explanation:
                "Clustering based on density; good for irregular shapes and noisy data."
            },
            {
              point: "Choosing the Right Clustering Method",
              explanation:
                "Which clustering algorithm suits which data type / distribution; evaluation of cluster quality (silhouette score etc.)."
            }
          ]
        },
        {
          title: "Dimensionality Reduction",
          duration: "40 min",
          content:
            "Learn techniques like PCA, t‑SNE to reduce dimensions of data, help visualization and remove redundant features.",
          keyPoints: [
            {
              point: "Principal Component Analysis (PCA)",
              explanation:
                "How PCA works by projecting data into fewer dimensions while preserving variance."
            },
            {
              point: "t‑SNE and UMAP",
              explanation:
                "Nonlinear projection methods useful for visualizing high‑dimensional data."
            },
            {
              point: "Feature Selection vs Dimension Reduction",
              explanation:
                "Difference between selecting existing features vs creating transformed features."
            }
          ]
        }
      ]
    },
    {
      title: "Model Evaluation & Deployment",
      lessons: [
        {
          title: "Model Validation & Tuning",
          duration: "50 min",
          content:
            "Learn how to split data into train/test/validation, cross‑validation, hyperparameter tuning, and selecting the best model.",
          keyPoints: [
            {
              point: "Train/Test Split & Cross‑Validation",
              explanation:
                "How to split data properly and use cross‑validation to estimate model generalization."
            },
            {
              point: "Hyperparameter Tuning",
              explanation:
                "Grid search, random search etc. to find the best hyperparameters."
            },
            {
              point: "Overfitting & Underfitting",
              explanation:
                "Learn what overfitting / underfitting are and how to mitigate them."
            },
            {
              point: "Bias‑Variance Tradeoff",
              explanation:
                "Understanding the trade‑off: when reducing bias increases variance, and vice versa."
            }
          ]
        },
        {
          title: "Deep Learning Basics",
          duration: "60 min",
          content:
            "Get introduced to deep learning: neural networks, activation functions, forward & backward propagation, training strategies.",
          keyPoints: [
            {
              point: "Neural Network Architecture",
              explanation:
                "What neurons, layers, weights, biases are; how they combine to form a network."
            },
            {
              point: "Activation Functions",
              explanation:
                "ReLU, sigmoid, tanh etc., and how they affect learning and gradients."
            },
            {
              point: "Loss Functions & Backpropagation",
              explanation:
                "How loss is calculated and minimized, how gradients are computed and weights updated."
            },
            {
              point: "Avoiding Vanishing / Exploding Gradients",
              explanation:
                "Techniques (normalization, careful initialization, batch normalization) to prevent training issues in deep nets."
            }
          ]
        },
        {
          title: "Final Project & Deployment",
          duration: "70 min",
          content:
            "Build a full ML project: from data (preprocessing) → modeling → evaluation → deployment (via API or web app).",
          keyPoints: [
            {
              point: "Project Planning & Dataset Collection",
              explanation:
                "Define the problem, source relevant datasets, ensure quality and relevance."
            },
            {
              point: "Model Building & Comparison",
              explanation:
                "Try multiple algorithms, compare their performance using metrics, choose best model."
            },
            {
              point: "Deployment as API / Web App",
              explanation:
                "Wrap your model into an API (Flask / FastAPI / Streamlit etc.) so other applications can access it."
            },
            {
              point: "Monitoring & Maintenance",
              explanation:
                "After deployment, monitor model performance, retrain when needed, handle drift."
            }
          ]
        }
      ]
    }
  ],
  features: [
    "Hands‑on coding exercises",
    "Real datasets and projects",
    "Hyperparameter tuning & evaluation metrics",
    "Deep learning introduction",
    "Model deployment & monitoring",
    "Certificate of completion",
    "Lifetime access",
    "Community support & Q&A"
  ]
};

export default machineLearningCourse;
