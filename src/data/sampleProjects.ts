import { Project } from "../types";

// Helper to create realistic SVG placeholder images that resemble handwritten notes & scans
function makeHandwrittenSvgDataUrl(title: string, lines: string[], bgType: "messy" | "clean" = "messy"): string {
  const bgFill = bgType === "messy" ? "#fbf8ee" : "#ffffff";
  const lineStroke = bgType === "messy" ? "#384152" : "#1e293b";
  const gridStroke = bgType === "messy" ? "rgba(180, 160, 130, 0.25)" : "rgba(226, 232, 240, 0.6)";

  const renderedLines = lines
    .map((line, idx) => {
      const y = 80 + idx * 30;
      const rotateDeg = bgType === "messy" ? (idx % 2 === 0 ? -0.4 : 0.6) : 0;
      return `<text x="45" y="${y}" font-family="'Courier New', monospace" font-weight="600" font-size="14" fill="${lineStroke}" transform="rotate(${rotateDeg} 45 ${y})">${line}</text>`;
    })
    .join("");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800">
    <defs>
      <pattern id="grid_${bgType}" width="24" height="24" patternUnits="userSpaceOnUse">
        <line x1="0" y1="24" x2="600" y2="24" stroke="${gridStroke}" stroke-width="1" />
        <line x1="60" y1="0" x2="60" y2="800" stroke="rgba(239, 68, 68, 0.3)" stroke-width="1.5" />
      </pattern>
    </defs>
    <rect width="600" height="800" fill="${bgFill}" />
    <rect width="600" height="800" fill="url(#grid_${bgType})" />
    <text x="75" y="45" font-family="'Courier New', monospace" font-weight="bold" font-size="16" fill="${lineStroke}">${title}</text>
    <line x1="45" y1="55" x2="550" y2="55" stroke="${lineStroke}" stroke-width="1.5" stroke-dasharray="${bgType === 'messy' ? '3,1' : 'none'}" />
    ${renderedLines}
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const INITIAL_PROJECTS: Project[] = [
  {
    id: "proj_cs_101",
    title: "Computer Science: Data Structures & BSTs",
    description: "Lecture notes and algorithms transcribed from handwritten spiral notebook pages.",
    subject: "Computer Science",
    styleTemplate: "Coding Notebook",
    createdAt: "2026-09-01T10:00:00Z",
    updatedAt: "2026-09-06T18:30:00Z",
    memory: {
      topicsStudied: ["Binary Search Trees", "In-Order Traversal", "Recursion & Big-O", "Self Balancing Trees"],
      weakAreas: ["Degenerate Tree Worst Case", "Deletion Edge Cases"],
      strongAreas: ["Search Algorithm", "In-Order Property", "Recurrence Relation"],
      completedChapters: ["Chapter 1: Tree Fundamentals", "Chapter 2: BST Properties & Search"],
      overallUnderstandingScore: 88,
      preferredLanguage: "English",
      totalQuizzesTaken: 4,
      averageQuizScore: 92,
      notesRevisedCount: 7,
    },
    chapters: [
      {
        id: "chap_1",
        number: 1,
        title: "Binary Search Tree Fundamentals & Properties",
        summary: "Introduction to hierarchical node structures, invariant comparisons, and recurrence relations.",
        pageIds: ["p1", "p2"],
        importantPoints: [
          { id: "ip1", text: "Every node key in the left subtree is strictly less than the root key.", importance: "HIGH" },
          { id: "ip2", text: "In-Order traversal on a BST produces sorted output.", importance: "HIGH" },
          { id: "ip3", text: "Unbalanced insertions cause O(n) degeneration into a linked list.", importance: "MEDIUM" },
        ],
        formulas: [
          { id: "f1", original: "T(n) = T(n/2) + O(1)", clean: "T(n) = T(n/2) + \\mathcal{O}(1) \\implies \\mathcal{O}(\\log n)", explanation: "Standard balanced search branch recurrence" }
        ],
        codeBlocks: [
          {
            id: "cb1",
            language: "cpp",
            code: "struct Node {\n  int key;\n  Node* left;\n  Node* right;\n  Node(int k) : key(k), left(nullptr), right(nullptr) {}\n};",
            explanation: "Basic node declaration with dynamic pointers"
          }
        ]
      },
      {
        id: "chap_2",
        number: 2,
        title: "Recursive Traversals & Search Algorithms",
        summary: "Step-by-step algorithms for In-Order, Pre-Order, and Post-Order depth-first graph traversals.",
        pageIds: ["p3"],
        importantPoints: [
          { id: "ip4", text: "Post-Order is required for safely freeing dynamically allocated subtrees.", importance: "HIGH" },
          { id: "ip5", text: "Pre-Order serialization allows exact tree reconstruction.", importance: "MEDIUM" }
        ],
        formulas: [],
        codeBlocks: [
          {
            id: "cb2",
            language: "javascript",
            code: "function inOrder(node, visited = []) {\n  if (!node) return visited;\n  inOrder(node.left, visited);\n  visited.push(node.key);\n  inOrder(node.right, visited);\n  return visited;\n}",
            explanation: "Functional JavaScript in-order traversal returning sorted keys"
          }
        ]
      }
    ],
    quizzes: [
      {
        id: "q1",
        type: "mcq",
        question: "What is the average time complexity of searching for an element in a balanced BST?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        correctAnswer: "O(log n)",
        explanation: "Each comparison halves the remaining search subspace, giving logarithmic time complexity.",
        commonMistake: "Confusing average case O(log n) with worst degenerate case O(n)."
      },
      {
        id: "q2",
        type: "true_false",
        question: "An In-Order traversal of a BST visits nodes in strictly descending order.",
        options: ["True", "False"],
        correctAnswer: "False",
        explanation: "In-Order visits (Left, Root, Right) which outputs elements in ascending non-decreasing order.",
      },
      {
        id: "q3",
        type: "fill_blank",
        question: "When keys are inserted in sorted order without balancing, a BST degenerates into a _______.",
        options: ["linked list", "heap", "trie", "hash table"],
        correctAnswer: "linked list",
        explanation: "Every node has only a single right child, leading to O(n) linked list behavior."
      }
    ],
    pages: [
      {
        id: "p1",
        pageNumber: 1,
        originalFileName: "handwritten_lecture_page1.jpg",
        originalImageUrl: makeHandwrittenSvgDataUrl("LEC 14: BST Properties & Invariants", [
          "Binary Search Tree Definition:",
          "- Root node holds key K",
          "- Left subtree: all keys < K",
          "- Right subtree: all keys > K",
          "- [unclear ink smear near margin]",
          "Recurrence relation:",
          "  T(n) = T(n/2) + O(1) -> O(log n)",
          "Node pointer layout:",
          "  struct Node { int val; Node* L; Node* R; };",
          "Note: If unbalanced -> skew occurs!"
        ], "messy"),
        enhancedImageUrl: makeHandwrittenSvgDataUrl("LEC 14: BST Properties & Invariants [ENHANCED]", [
          "Binary Search Tree Definition:",
          "- Root node holds key K",
          "- Left subtree: all keys < K",
          "- Right subtree: all keys > K",
          "- Invariant holds recursively for all descendants",
          "Recurrence relation:",
          "  T(n) = T(n/2) + O(1) -> O(log n)",
          "Node pointer layout:",
          "  struct Node { int val; Node* L; Node* R; };",
          "Note: If unbalanced -> skew occurs!"
        ], "clean"),
        rotation: 0,
        qualityScore: 89,
        readabilityScore: 92,
        ocrConfidence: 95,
        subjectConfidence: 98,
        subject: "Computer Science",
        topic: "Binary Search Tree Invariants",
        subtopics: ["Node Struct", "Branch Invariant", "Recurrence Relation"],
        chapterIndex: 1,
        extractedText: `LEC 14: BST Properties & Invariants\nBinary Search Tree Definition:\n- Root node holds key K\n- Left subtree: all keys < K\n- Right subtree: all keys > K\n- [Text unclear — please review original image]\nRecurrence relation:\n  T(n) = T(n/2) + O(1) -> O(log n)\nNode pointer layout:\n  struct Node { int val; Node* L; Node* R; };\nNote: If unbalanced -> skew occurs!`,
        status: "completed",
        notes: {
          title: "Binary Search Tree Invariants & Structural Invariants",
          topic: "Binary Search Trees",
          subtopics: ["Node Definition", "Left/Right Invariant", "Search Efficiency"],
          headings: ["1. Invariant Properties", "2. Computational Complexity", "3. Structural Skew Warning"],
          importantPoints: [
            { id: "ip_p1_1", text: "Left subtree keys must strictly precede the node key.", importance: "HIGH" },
            { id: "ip_p1_2", text: "Search complexity is O(log n) on average, but degenerates to O(n) if unbalanced.", importance: "HIGH" },
            { id: "ip_p1_3", text: "Every subtree recursively satisfies the exact same BST property.", importance: "MEDIUM" }
          ],
          definitions: [
            { id: "def_1", term: "BST Invariant", definition: "For any node N, every key in Left(N) < key(N) < every key in Right(N)." }
          ],
          formulas: [
            { id: "form_1", original: "T(n) = T(n/2) + O(1)", clean: "T(n) = T(n/2) + \\mathcal{O}(1) \\implies \\mathcal{O}(\\log n)", explanation: "Recurrence relation for binary partition search." }
          ],
          codeBlocks: [
            {
              id: "code_p1_1",
              language: "cpp",
              code: "struct Node {\n  int val;\n  Node* left;\n  Node* right;\n  Node(int v) : val(v), left(nullptr), right(nullptr) {}\n};",
              explanation: "Standard C++ node representation with initialized child pointers."
            }
          ],
          diagrams: [
            {
              id: "diag_1",
              title: "Binary Search Tree Hierarchical Model",
              type: "flowchart",
              description: "Binary Search Tree showing Root (8), Left Child (3), Right Child (10)",
              svgContent: `<svg viewBox="0 0 400 200" class="w-full h-auto max-h-56">
                <circle cx="200" cy="40" r="22" fill="#4f46e5" />
                <text x="200" y="46" fill="#fff" font-weight="bold" text-anchor="middle" font-size="14">8</text>
                <line x1="185" y1="55" x2="115" y2="105" stroke="#94a3b8" stroke-width="2" />
                <line x1="215" y1="55" x2="285" y2="105" stroke="#94a3b8" stroke-width="2" />
                <circle cx="100" cy="120" r="20" fill="#0284c7" />
                <text x="100" y="125" fill="#fff" font-weight="bold" text-anchor="middle" font-size="13">3</text>
                <circle cx="300" cy="120" r="20" fill="#0284c7" />
                <text x="300" y="125" fill="#fff" font-weight="bold" text-anchor="middle" font-size="13">10</text>
                <line x1="90" y1="135" x2="60" y2="165" stroke="#94a3b8" stroke-width="2" />
                <circle cx="50" cy="175" r="16" fill="#10b981" />
                <text x="50" y="179" fill="#fff" font-weight="bold" text-anchor="middle" font-size="11">1</text>
                <line x1="110" y1="135" x2="140" y2="165" stroke="#94a3b8" stroke-width="2" />
                <circle cx="150" cy="175" r="16" fill="#10b981" />
                <text x="150" y="179" fill="#fff" font-weight="bold" text-anchor="middle" font-size="11">6</text>
              </svg>`,
              isAiGenerated: true
            }
          ],
          keyTakeaways: [
            "A BST is essentially an ordered collection optimized for binary logarithmic lookup.",
            "Always consider tree balance to prevent performance degradation."
          ],
          summary: "This page establishes the foundational node struct, the recursive invariant property, and mathematical recurrence relations for BST operations."
        }
      },
      {
        id: "p2",
        pageNumber: 2,
        originalFileName: "handwritten_lecture_page2.jpg",
        originalImageUrl: makeHandwrittenSvgDataUrl("BST Search & Insertion Logic", [
          "Search Algorithm Logic:",
          "1. If root == null -> return false",
          "2. If target == root.val -> return true",
          "3. If target < root.val -> Search(root.left, target)",
          "4. Else -> Search(root.right, target)",
          "",
          "Insertion Steps:",
          "- Traverse until empty leaf slot found",
          "- Link new node at appropriate side",
          "- Duplicates: usually ignored or counted in frequency field"
        ], "messy"),
        enhancedImageUrl: makeHandwrittenSvgDataUrl("BST Search & Insertion Logic [ENHANCED]", [
          "Search Algorithm Logic:",
          "1. If root == null -> return false",
          "2. If target == root.val -> return true",
          "3. If target < root.val -> Search(root.left, target)",
          "4. Else -> Search(root.right, target)",
          "",
          "Insertion Steps:",
          "- Traverse until empty leaf slot found",
          "- Link new node at appropriate side",
          "- Duplicates: usually ignored or counted in frequency field"
        ], "clean"),
        rotation: 0,
        qualityScore: 91,
        readabilityScore: 94,
        ocrConfidence: 96,
        subjectConfidence: 99,
        subject: "Computer Science",
        topic: "Search & Insertion Operations",
        subtopics: ["Recursive Search", "Insertion Strategy", "Duplicate Policy"],
        chapterIndex: 1,
        extractedText: `Search Algorithm Logic:\n1. If root == null -> return false\n2. If target == root.val -> return true\n3. If target < root.val -> Search(root.left, target)\n4. Else -> Search(root.right, target)\n\nInsertion Steps:\n- Traverse until empty leaf slot found\n- Link new node at appropriate side\n- Duplicates: usually ignored or counted in frequency field`,
        status: "completed",
        notes: {
          title: "BST Search and Insertion Procedures",
          topic: "Algorithm Implementation",
          subtopics: ["Recursive Branching", "Leaf Insertion", "Edge Conditions"],
          headings: ["Search Traversal Flow", "Leaf Insertion Algorithm"],
          importantPoints: [
            { id: "ip_p2_1", text: "Search terminates either at matching key or null pointer.", importance: "HIGH" },
            { id: "ip_p2_2", text: "Insertion always places the new element as a leaf node in standard BSTs.", importance: "MEDIUM" }
          ],
          definitions: [
            { id: "def_2", term: "Leaf Node", definition: "A node that has neither left nor right child pointers (degree 0)." }
          ],
          formulas: [],
          codeBlocks: [
            {
              id: "code_p2_1",
              language: "python",
              code: "def search(root, key):\n    if root is None or root.val == key:\n        return root\n    if key < root.val:\n        return search(root.left, key)\n    return search(root.right, key)",
              explanation: "Concise recursive search implementation in Python"
            }
          ],
          diagrams: [],
          keyTakeaways: [
            "Recursive search mirrors binary search on sorted arrays.",
            "Each decision branch cuts off approximately 50% of candidate nodes."
          ],
          summary: "Details the step-by-step algorithms for searching and inserting elements within binary search trees."
        }
      },
      {
        id: "p3",
        pageNumber: 3,
        originalFileName: "handwritten_lecture_page3.jpg",
        originalImageUrl: makeHandwrittenSvgDataUrl("Depth First Traversals (In/Pre/Post)", [
          "Traversal Orders:",
          "1. In-Order: Left -> Root -> Right",
          "   Yields non-decreasing keys",
          "2. Pre-Order: Root -> Left -> Right",
          "   Great for cloning / prefix evaluation",
          "3. Post-Order: Left -> Right -> Root",
          "   Essential for destructor / deletion",
          "Memory footprint: O(h) where h is tree height."
        ], "messy"),
        enhancedImageUrl: makeHandwrittenSvgDataUrl("Depth First Traversals [ENHANCED]", [
          "Traversal Orders:",
          "1. In-Order: Left -> Root -> Right",
          "   Yields non-decreasing keys",
          "2. Pre-Order: Root -> Left -> Right",
          "   Great for cloning / prefix evaluation",
          "3. Post-Order: Left -> Right -> Root",
          "   Essential for destructor / deletion",
          "Memory footprint: O(h) where h is tree height."
        ], "clean"),
        rotation: 0,
        qualityScore: 93,
        readabilityScore: 95,
        ocrConfidence: 97,
        subjectConfidence: 99,
        subject: "Computer Science",
        topic: "Depth-First Tree Traversals",
        subtopics: ["In-Order", "Pre-Order", "Post-Order"],
        chapterIndex: 2,
        extractedText: `Traversal Orders:\n1. In-Order: Left -> Root -> Right\n   Yields non-decreasing keys\n2. Pre-Order: Root -> Left -> Right\n   Great for cloning / prefix evaluation\n3. Post-Order: Left -> Right -> Root\n   Essential for destructor / deletion\nMemory footprint: O(h) where h is tree height.`,
        status: "completed",
        notes: {
          title: "Comprehensive Tree Traversal Strategies",
          topic: "Traversals",
          subtopics: ["In-Order", "Pre-Order", "Post-Order", "Call Stack Footprint"],
          headings: ["Depth-First Traversal Matrix", "Stack Space Considerations"],
          importantPoints: [
            { id: "ip_p3_1", text: "In-Order traversal is the canonical way to retrieve BST keys in ascending order.", importance: "HIGH" },
            { id: "ip_p3_2", text: "Post-Order traversal processes children before parents, preventing orphaned pointer memory leaks.", importance: "HIGH" },
            { id: "ip_p3_3", text: "Maximum recursion stack depth equals tree height O(h).", importance: "MEDIUM" }
          ],
          definitions: [
            { id: "def_3", term: "Depth-First Traversal", definition: "An algorithm for traversing tree data structures by exploring as deep as possible along each branch before backtracking." }
          ],
          formulas: [
            { id: "form_p3_1", original: "Space = O(h)", clean: "S(h) = \\mathcal{O}(h) \\quad (\\log n \\le h \\le n)", explanation: "Recursion call stack memory bound based on height." }
          ],
          codeBlocks: [
            {
              id: "code_p3_1",
              language: "javascript",
              code: "function inOrder(node, result = []) {\n  if (!node) return result;\n  inOrder(node.left, result);\n  result.push(node.val);\n  inOrder(node.right, result);\n  return result;\n}",
              explanation: "Returns sorted array of node values using in-order traversal."
            }
          ],
          diagrams: [
            {
              id: "diag_p3_1",
              title: "Traversal Order Comparison",
              type: "chart",
              description: "Comparison chart of In-Order, Pre-Order, and Post-Order applications",
              svgContent: `<svg viewBox="0 0 420 160" class="w-full h-auto">
                <rect x="10" y="10" width="120" height="140" rx="8" fill="#f8fafc" stroke="#cbd5e1" />
                <text x="70" y="35" font-weight="bold" font-size="12" fill="#4338ca" text-anchor="middle">In-Order</text>
                <text x="70" y="60" font-size="10" fill="#475569" text-anchor="middle">L → Root → R</text>
                <text x="70" y="90" font-size="9.5" fill="#1e293b" text-anchor="middle">Sorted keys</text>
                <text x="70" y="110" font-size="9.5" fill="#1e293b" text-anchor="middle">BST validation</text>

                <rect x="150" y="10" width="120" height="140" rx="8" fill="#f8fafc" stroke="#cbd5e1" />
                <text x="210" y="35" font-weight="bold" font-size="12" fill="#0284c7" text-anchor="middle">Pre-Order</text>
                <text x="210" y="60" font-size="10" fill="#475569" text-anchor="middle">Root → L → R</text>
                <text x="210" y="90" font-size="9.5" fill="#1e293b" text-anchor="middle">Tree cloning</text>
                <text x="210" y="110" font-size="9.5" fill="#1e293b" text-anchor="middle">Serialization</text>

                <rect x="290" y="10" width="120" height="140" rx="8" fill="#f8fafc" stroke="#cbd5e1" />
                <text x="350" y="35" font-weight="bold" font-size="12" fill="#059669" text-anchor="middle">Post-Order</text>
                <text x="350" y="60" font-size="10" fill="#475569" text-anchor="middle">L → R → Root</text>
                <text x="350" y="90" font-size="9.5" fill="#1e293b" text-anchor="middle">Memory freeing</text>
                <text x="350" y="110" font-size="9.5" fill="#1e293b" text-anchor="middle">Bottom-up eval</text>
              </svg>`,
              isAiGenerated: true
            }
          ],
          keyTakeaways: [
            "Match traversal strategy to the operational objective.",
            "Recursion depth is directly proportional to tree balance."
          ],
          summary: "Examines DFS traversal variations, their recursive execution order, and practical software engineering applications."
        }
      }
    ]
  },
  {
    id: "proj_physics_201",
    title: "Physics & Calculus: Classical Mechanics",
    description: "Handwritten laboratory notes on projectile motion, Newton's laws, and differential equations.",
    subject: "Physics",
    styleTemplate: "Science Notebook",
    createdAt: "2026-09-03T14:20:00Z",
    updatedAt: "2026-09-05T09:15:00Z",
    memory: {
      topicsStudied: ["Kinematics Equations", "Newton's Second Law", "Differential Calculus for Velocity"],
      weakAreas: ["Air Resistance Integration"],
      strongAreas: ["Constant Acceleration", "Vectors Decomposition"],
      completedChapters: ["Chapter 1: Kinematics"],
      overallUnderstandingScore: 84,
      preferredLanguage: "English",
      totalQuizzesTaken: 2,
      averageQuizScore: 86,
      notesRevisedCount: 4,
    },
    chapters: [
      {
        id: "chap_phys_1",
        number: 1,
        title: "Kinematics in Two Dimensions",
        summary: "Calculus foundations of velocity, acceleration, and projectile trajectory.",
        pageIds: ["p_phys_1"],
        importantPoints: [
          { id: "ip_phys_1", text: "Horizontal velocity remains constant in ideal projectile motion.", importance: "HIGH" },
          { id: "ip_phys_2", text: "Vertical acceleration is solely governed by gravity g = 9.8 m/s^2.", importance: "HIGH" }
        ],
        formulas: [
          { id: "f_phys_1", original: "v = u + at", clean: "v(t) = v_0 + a t", explanation: "Linear velocity with constant acceleration" },
          { id: "f_phys_2", original: "s = ut + 0.5at^2", clean: "s(t) = s_0 + v_0 t + \\frac{1}{2} a t^2", explanation: "Kinematic displacement integral" }
        ],
        codeBlocks: []
      }
    ],
    quizzes: [
      {
        id: "qp1",
        type: "mcq",
        question: "In the absence of air resistance, what happens to the horizontal velocity of a projectile?",
        options: ["It accelerates continuously", "It remains constant", "It decreases linearly", "It fluctuates sinusoidally"],
        correctAnswer: "It remains constant",
        explanation: "No net horizontal force acts on the projectile (a_x = 0), so velocity is conserved.",
      }
    ],
    pages: [
      {
        id: "p_phys_1",
        pageNumber: 1,
        originalFileName: "physics_handwritten_lab.jpg",
        originalImageUrl: makeHandwrittenSvgDataUrl("Physics Lab: Kinematics & Calculus", [
          "Newton's Second Law: F = m*a",
          "Acceleration as derivative: a(t) = dv/dt = d^2x/dt^2",
          "Trajectory equations under constant g:",
          "  x(t) = (v0 * cos(theta)) * t",
          "  y(t) = (v0 * sin(theta)) * t - 0.5*g*t^2",
          "Peak height occurs when dy/dt = 0",
          "t_peak = (v0 * sin(theta)) / g",
          "Total Range R = (v0^2 * sin(2*theta)) / g"
        ], "messy"),
        enhancedImageUrl: makeHandwrittenSvgDataUrl("Physics Lab: Kinematics & Calculus [ENHANCED]", [
          "Newton's Second Law: F = m*a",
          "Acceleration as derivative: a(t) = dv/dt = d^2x/dt^2",
          "Trajectory equations under constant g:",
          "  x(t) = (v0 * cos(theta)) * t",
          "  y(t) = (v0 * sin(theta)) * t - 0.5*g*t^2",
          "Peak height occurs when dy/dt = 0",
          "t_peak = (v0 * sin(theta)) / g",
          "Total Range R = (v0^2 * sin(2*theta)) / g"
        ], "clean"),
        rotation: 0,
        qualityScore: 94,
        readabilityScore: 96,
        ocrConfidence: 98,
        subjectConfidence: 99,
        subject: "Physics",
        topic: "Two-Dimensional Kinematics",
        subtopics: ["Calculus Derivations", "Peak Flight Time", "Maximum Range"],
        chapterIndex: 1,
        extractedText: `Newton's Second Law: F = m*a\nAcceleration as derivative: a(t) = dv/dt = d^2x/dt^2\nTrajectory equations under constant g:\n  x(t) = (v0 * cos(theta)) * t\n  y(t) = (v0 * sin(theta)) * t - 0.5*g*t^2\nPeak height occurs when dy/dt = 0\nt_peak = (v0 * sin(theta)) / g\nTotal Range R = (v0^2 * sin(2*theta)) / g`,
        status: "completed",
        notes: {
          title: "Differential Kinematics and Parabolic Trajectories",
          topic: "Classical Mechanics",
          subtopics: ["Derivative Relationships", "Parametric Equations", "Peak Condition"],
          headings: ["1. Differential Foundations", "2. Parametric Trajectory Equations", "3. Flight Metrics"],
          importantPoints: [
            { id: "ip_ph1", text: "Acceleration is the second time-derivative of position vector r(t).", importance: "HIGH" },
            { id: "ip_ph2", text: "Vertical velocity reaches instantaneous zero at maximum trajectory height.", importance: "HIGH" },
            { id: "ip_ph3", text: "Optimal launch angle for maximum flat ground range is 45 degrees.", importance: "MEDIUM" }
          ],
          definitions: [
            { id: "def_ph1", term: "Projectile Motion", definition: "A form of motion experienced by an object launched into the air, subject only to acceleration due to gravity." }
          ],
          formulas: [
            { id: "f_ph1", original: "a = d^2x/dt^2", clean: "a(t) = \\frac{d^2 x}{dt^2} = \\frac{dv}{dt}", explanation: "Definition of instantaneous acceleration as second derivative of position." },
            { id: "f_ph2", original: "R = (v0^2 sin(2theta))/g", clean: "R = \\frac{v_0^2 \\sin(2\\theta)}{g}", explanation: "Flat-ground horizontal projectile range formula." }
          ],
          codeBlocks: [],
          diagrams: [
            {
              id: "diag_ph1",
              title: "Parabolic Projectile Trajectory",
              type: "geometry",
              description: "Parabolic path showing velocity vector decomposition at launch, apex, and impact",
              svgContent: `<svg viewBox="0 0 400 180" class="w-full h-auto">
                <line x1="30" y1="150" x2="370" y2="150" stroke="#475569" stroke-width="2" />
                <path d="M 40 150 Q 200 20 360 150" fill="none" stroke="#2563eb" stroke-width="3" stroke-dasharray="4,2" />
                <circle cx="200" cy="85" r="5" fill="#dc2626" />
                <text x="200" y="70" font-weight="bold" font-size="11" fill="#dc2626" text-anchor="middle">Apex (vy = 0)</text>
                <text x="50" y="130" font-size="10" fill="#1e293b">v0, θ</text>
                <text x="350" y="170" font-size="10" fill="#475569">Range R</text>
              </svg>`,
              isAiGenerated: true
            }
          ],
          keyTakeaways: [
            "Orthogonal velocity components are completely decoupled under Newtonian gravity.",
            "Integration of constant acceleration yields quadratic parabolic trajectory."
          ],
          summary: "Derives the differential equations of kinematics, solving parametric equations for projectile motion and apex conditions."
        }
      }
    ]
  }
];
