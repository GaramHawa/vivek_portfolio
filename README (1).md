# A Generalized Binary-Decomposition Framework for Scalable Image Classification Across Diverse Image Datasets

This repository contains the implementation, models, evaluation scripts, and reports for the **One-vs-All (OvA) Binary-Decomposition Framework for Image Classification**. In multi-class image classification, scaling to a large number of classes often introduces complexity, class imbalances, and classification bottlenecks. This project presents a dataset-agnostic One-vs-All framework that decomposes a multi-class classification problem into multiple binary classification tasks, comparing two distinct architectural approaches.

---

## 👥 Authors
*   **Amey Vinod Rassekar** (Reg No: 23BCE8587) - Department of AI & ML, VIT-AP
*   **Changela Vivek Vimalbhai** (Reg No: 23BCE8743) - Department of AI & ML, VIT-AP
*   **Submitted to:** Dr. E. Sreenivasa Reddy (Professor-HAG, SCOPE, VIT-AP)
*   **Course Code:** CSE4019 - Applications of Artificial Intelligence (Project-Based embedded EPJ)

---

## 📂 Project Architecture & Repository Structure

The repository is structured dynamically to support the generalized classification framework across multiple datasets:

```directory
final final/
├── README.md                           # Main project documentation
├── Report.docx                         # Comprehensive Project Report (Word Document)
├── Report.pdf                          # Comprehensive Project Report (PDF Document)
├── Project book model.docx             # Structural template / project book
├── final report submission final.docx  # ROV Voyager Project Report (additional reference)
│
├── jelly_data/                         # Jellyfish Classification Dataset (6 Classes)
│   ├── Train/                          # Training subset (split into class folders)
│   └── test/                           # Testing subset (split into class folders)
│
├── multimodalova/                      # APPROACH 1: Independent Binary Classifiers
│   ├── approach1.ipynb                 # Jupyter Notebook containing training and evaluation
│   ├── 03.jpg                          # Preprocessing sample image
│   └── *binary_model.pth               # Saved PyTorch weights for binary classifiers
│
├── uniova/                             # APPROACH 2: Unified Multi-Head Model
│   ├── approach2.ipynb                 # Jupyter Notebook containing training and evaluation
│   ├── 03.jpg                          # Preprocessing sample image
│   └── jellyfish.pth                   # Saved PyTorch weights for the unified ResNet-18 model
│
└── images/                             # Saved plots, training curves, and confusion matrices
    ├── dataset_structure.png           # Dataset folder hierarchy diagram
    ├── approach1_architecture.png      # Approach 1 (independent classifiers) framework diagram
    ├── approach1_metrics.png           # Approach 1 training loss plot from report
    ├── approach1_confusion_matrix_report.png  # Approach 1 Confusion Matrix (Report - 60% accuracy)
    ├── approach2_architecture.png      # Approach 2 (unified shared features) architecture diagram
    ├── approach2_confusion_matrix_report.png  # Approach 2 Confusion Matrix (Report - 95% accuracy)
    ├── comparison_metrics.png          # Performance comparison chart from the report
    ├── approach1_confusion_matrix_alzheimers.png  # Approach 1 Confusion Matrix on Alzheimer's MRI (Notebook - 97.58%)
    ├── approach1_per_class_accuracy_alzheimers.png # Approach 1 Per-Class Accuracy on Alzheimer's MRI
    ├── approach2_training_loss_jellyfish.png      # Approach 2 Training Loss on Jellyfish Dataset
    └── approach2_confusion_matrix_jellyfish.png   # Approach 2 Confusion Matrix on Jellyfish Dataset (95%)
```

---

## 🛠️ Dataset Specifications

The framework is evaluated across two diverse, challenging datasets:

### 1. Jellyfish Classification Dataset (`jelly_data/`)
*   **Goal:** Classify marine species into six distinct categories.
*   **Classes ($N = 6$):**
    1.  `Moon_jellyfish`
    2.  `barrel_jellyfish`
    3.  `blue_jellyfish`
    4.  `compass_jellyfish`
    5.  `lions_mane_jellyfish`
    6.  `mauve_stinger_jellyfish`
*   **Preprocessing:** Image resizing to $224 \times 224$ pixels, scaling pixel values, and normalizing with mean/standard deviation $[0.5, 0.5, 0.5]$ per channel.

### 2. Alzheimer's MRI Dataset (Evaluated in `approach1.ipynb`)
*   **Goal:** Classify brain MRI scans to determine the level of dementia.
*   **Classes ($N = 4$):**
    1.  `Mild Impairment`
    2.  `Moderate Impairment`
    3.  `No Impairment`
    4.  `Very Mild Impairment`
*   **Preprocessing:** Resized to $224 \times 224$ pixels, converted to PyTorch float tensors.

---

## 🔬 Proposed Methodologies

### 📌 Approach 1: Independent One-vs-All Binary Models
*   **Directory:** [multimodalova/](file:///d:/Study/apps%20of%20ai/project/final%20final/multimodalova/) | **Notebook:** [approach1.ipynb](file:///d:/Study/apps%20of%20ai/project/final%20final/multimodalova/approach1.ipynb)
*   **Framework Diagram:**
    ![Approach 1 Framework](images/approach1_architecture.png)

#### Description:
In the classical One-vs-All decomposition framework, the multi-class dataset is programmatically split into $N$ separate binary datasets. For each target class $C_i$, positive samples are defined as images belonging to $C_i$, and negative samples are all other images combined. 

An independent convolutional neural network (**BinaryCNN**) is trained for each class.
$$\text{Output}_i = \text{BinaryCNN}_i(x)$$
During inference, a test image is fed to all $N$ binary models. Each model outputs a raw logit value which is passed through a sigmoid function to compute the class probability:
$$P(C_i \mid x) = \sigma(\text{Output}_i) = \frac{1}{1 + e^{-\text{Output}_i}}$$
The final prediction is selected as the class that yields the maximum probability:
$$\hat{y} = \arg\max_{i \in \{1,\dots,N\}} P(C_i \mid x)$$

#### Architecture:
```python
# Custom CNN architecture with Batch Normalization and Global Average Pooling
class JellyfishBinaryCNN(nn.Module):
    def __init__(self):
        super().__init__()
        self.conv1 = nn.Conv2d(3, 32, 3, padding=1)
        self.bn1 = nn.BatchNorm2d(32)
        self.conv2 = nn.Conv2d(32, 64, 3, padding=1)
        self.bn2 = nn.BatchNorm2d(64)
        self.conv3 = nn.Conv2d(64, 128, 3, padding=1)
        self.bn3 = nn.BatchNorm2d(128)
        self.pool = nn.MaxPool2d(2, 2)
        self.gap = nn.AdaptiveAvgPool2d(1)
        self.fc1 = nn.Linear(128, 64)
        self.out = nn.Linear(64, 1)

    def forward(self, x):
        x = self.pool(torch.relu(self.bn1(self.conv1(x))))
        x = self.pool(torch.relu(self.bn2(self.conv2(x))))
        x = self.pool(torch.relu(self.bn3(self.conv3(x))))
        x = self.gap(x)
        x = torch.flatten(x, 1)
        x = torch.relu(self.fc1(x))
        x = self.out(x)
        return x
```

*   **Pros:** Modularity (models can be added/removed/retrained for specific classes without retraining other classes), easy feature isolation.
*   **Cons:** Extremely high computational redundancy (features are extracted from scratch $N$ times), linear scaling of training time with class count ($O(N)$), data fragmentation.

---

### 📌 Approach 2: Unified One-vs-All Model with Shared Features
*   **Directory:** [uniova/](file:///d:/Study/apps%20of%20ai/project/final%20final/uniova/) | **Notebook:** [approach2.ipynb](file:///d:/Study/apps%20of%20ai/project/final%20final/uniova/approach2.ipynb)
*   **Framework Diagram:**
    ![Approach 2 Framework](images/approach2_architecture.png)

#### Description:
To address the computational bottleneck and redundancy of independent models, Approach 2 utilizes a **Unified OvA Model**. Rather than training separate networks, a single deep neural network with a shared feature representation backbone (ResNet-18) is used. The network branches out at the final layer into $N$ linear classifier heads, each corresponding to a class.

A single forward pass computes all class predictions simultaneously:
$$\mathbf{Output} = \text{UnifiedOvAModel}(x) = [\text{head}_1(f), \text{head}_2(f), \dots, \text{head}_N(f)]$$
The model is trained end-to-end using the **Binary Cross-Entropy with Logits Loss (BCEWithLogitsLoss)** across all heads, computed on one-hot-encoded labels:
$$\mathcal{L} = -\frac{1}{N}\sum_{i=1}^{N} \left[ y_i \log(\sigma(\text{Output}_i)) + (1 - y_i) \log(1 - \sigma(\text{Output}_i)) \right]$$
During prediction, the outputs from all heads are compared, and the head with the highest activation/logit is chosen:
$$\hat{y} = \arg\max_{i \in \{1,\dots,N\}} \text{Output}_i$$

#### Architecture:
```python
class UnifiedOvAModel(nn.Module):
    def __init__(self, num_classes):
        super().__init__()
        # Pretrained ResNet-18 as shared feature extraction backbone
        backbone = models.resnet18(pretrained=True)
        self.features = nn.Sequential(*list(backbone.children())[:-1])
        in_features = backbone.fc.in_features
        
        # Branching linear heads for each class
        self.heads = nn.ModuleList([
            nn.Linear(in_features, 1) for _ in range(num_classes)
        ])
    
    def forward(self, x):
        x = self.features(x)
        x = torch.flatten(x, 1)
        
        # Compute activations for all OvA binary tasks
        outputs = [head(x) for head in self.heads]
        return torch.cat(outputs, dim=1)
```

*   **Pros:** Highly efficient training and inference, elimination of redundant feature extraction layers, global feature learning across all classes, uniform scaling.
*   **Cons:** Retraining is required if a new class is added, although only the final linear head layers can be fine-tuned.

---

## 📊 Experimental Results & Discussion

### 1. Overall Performance Comparison
The performance evaluation on the Jellyfish classification dataset demonstrates a massive performance difference between the two architectures:

| Metric | Approach 1 (Independent Binary CNNs) | Approach 2 (Unified ResNet-18 OvA) |
| :--- | :---: | :---: |
| **Model Architecture** | Custom CNN per class (6 Models) | ResNet-18 + Multi-Head (1 Model) |
| **Backbone/Feature Sharing** | None (Independent Learning) | Shared ResNet-18 Features |
| **Optimizers / Parameters** | $6 \times$ Adam ($\text{lr} = 10^{-4}$) | $1 \times$ Adam ($\text{lr} = 10^{-4}$) |
| **Overall Accuracy (Report)** | **$60.00\%$** | **$95.00\%$** |
| **Jellyfish Test Accuracy (Empirical)**| **$20.00\%$** (due to severe binary imbalance/overfitting) | **$95.00\%$** (38/40 test images correct) |
| **Alzheimer's MRI Accuracy** | **$97.58\%$** (Evaluated in `approach1.ipynb`) | Not evaluated |
| **Training Time Complexity** | $O(N)$ (Scales linearly) | $O(1)$ (Constant backbone pass) |
| **Inference Latency** | High ($N \times$ CNN Forward passes) | Low (1 ResNet-18 Forward pass) |

---

### 2. Graphical Plots & Confusion Matrices

#### 📈 Approach 1 Visualizations (Alzheimer's MRI Dataset)
*   **Confusion Matrix (97.58% Overall Accuracy):**
    ![Approach 1 Confusion Matrix](images/approach1_confusion_matrix_alzheimers.png)
*   **Per-Class Accuracy Plot:**
    ![Approach 1 Per-Class Accuracy](images/approach1_per_class_accuracy_alzheimers.png)

#### 📈 Approach 1 Visualizations (Jellyfish Dataset - Report Analysis)
*   **Confusion Matrix (60% Overall Accuracy):**
    ![Approach 1 Confusion Matrix Report](images/approach1_confusion_matrix_report.png)

#### 📈 Approach 2 Visualizations (Jellyfish Dataset - Empirical)
*   **Training Loss Curve (10 Epochs):**
    ![Approach 2 Training Loss Curve](images/approach2_training_loss_jellyfish.png)
*   **Confusion Matrix (95% Overall Accuracy):**
    ![Approach 2 Confusion Matrix Jellyfish](images/approach2_confusion_matrix_jellyfish.png)
*   **Confusion Matrix (Report):**
    ![Approach 2 Confusion Matrix Report](images/approach2_confusion_matrix_report.png)

#### 📈 Comparative Summary Chart
*   **Overall Performance Comparison (Approach 1 vs Approach 2):**
    ![Comparison Chart](images/comparison_metrics.png)

---

## 💡 Key Findings & Observations
1.  **Feature Representation:** Approach 2 outperforms Approach 1 by a massive margin because it utilizes pre-trained ResNet-18 weights (ImageNet) and shares low-level features (edges, textures) across all classification tasks. In contrast, Approach 1 trains small ConvNets from scratch on fragmented datasets, leading to significant overfitting on binary subclasses.
2.  **Dataset-Agnostic Setup:** The repository directory structure allows automatic folder scanning. When new directories (classes) are added to the dataset folder, the code dynamically instantiates the correct number of binary classifiers or output heads without manual code modifications.
3.  **Prediction Calibrations:** The unified multi-head model outputs all predictions simultaneously, facilitating better score comparison. In Approach 1, because binary models are trained separately, their output scales differ, occasionally leading to ambiguous classifications during Argmax calculation.
4.  **Training Efficiency:** Approach 2 trains in a fraction of the time needed for Approach 1 since the convolutional layers are processed only once per batch.

---

## ⚙️ Environment Setup & Executing Code

### Prerequisites
*   **OS:** Windows 10/11 or Linux
*   **GPU:** CUDA-enabled GPU (Highly recommended for ResNet-18)
*   **Environment Manager:** Anaconda / Miniconda

### Installation & Execution
1.  **Create Conda Environment:**
    ```bash
    conda create -n aiml python=3.9
    conda activate aiml
    ```
2.  **Install PyTorch and Dependencies:**
    ```bash
    conda install pytorch torchvision pytorch-cuda=11.8 -c pytorch -c nvidia
    pip install matplotlib seaborn scikit-learn pillow jupyter
    ```
3.  **Run Approach 1 Notebook (Independent Binary Models):**
    *   Navigate to `multimodalova/`
    *   Open `approach1.ipynb` in Jupyter Notebook and execute all cells.
4.  **Run Approach 2 Notebook (Unified Model):**
    *   Navigate to `uniova/`
    *   Open `approach2.ipynb` in Jupyter Notebook and execute all cells.
5.  **Evaluate Unified Model using Weights:**
    Run the evaluation script to test the model's accuracy on the test set:
    ```bash
    python -c "
    import torch
    # Add evaluation script block to load uniova/jellyfish.pth and predict jelly_data/test
    "
    ```
