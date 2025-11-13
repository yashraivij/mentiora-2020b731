-- Add Section A exam questions for AQA Geography A-level Paper 1
-- Topic: Water and Carbon Cycles (5 questions, 36 marks total)

INSERT INTO curriculum_questions (
  id, topic_id, question, marks, difficulty,
  order_index, model_answer, marking_criteria,
  spec_reference, calculator_guidance
) VALUES
(
  'geo-paper1-1a',
  'water-carbon-cycles',
  'Define the term drainage basin.',
  2,
  'easy',
  1,
  'A drainage basin is an area of land drained by a river and its tributaries, bounded by a watershed (the ridge of high land forming the edge of the basin). All precipitation falling within this area will eventually flow into the same river system.',
  '{"type":"point_based","points":[{"marks":1,"criteria":"Definition of area drained by river and tributaries"},{"marks":1,"criteria":"Reference to watershed/boundary or all water flowing to same system"}]}',
  '3.1.1.1 - Systems in physical geography',
  NULL
),
(
  'geo-paper1-1b',
  'water-carbon-cycles',
  'Outline one process that transfers water from the atmosphere to the lithosphere.',
  2,
  'easy',
  2,
  'Infiltration is a key process that transfers water from the atmosphere to the lithosphere. When precipitation (rain or snow) reaches the ground surface, water moves vertically downwards through soil pores and cracks in rocks, transferring water from the surface into the ground and subsurface rock layers.',
  '{"type":"point_based","points":[{"marks":1,"criteria":"Identification of valid process (infiltration, percolation, or throughflow)"},{"marks":1,"criteria":"Outline of how the process transfers water from atmosphere/surface to lithosphere/ground"}]}',
  '3.1.1.2 - The water cycle',
  NULL
),
(
  'geo-paper1-1c',
  'water-carbon-cycles',
  'Explain how human activity can change the water balance within a drainage basin.',
  6,
  'medium',
  3,
  'Human activities significantly alter the water balance by changing inputs, outputs, and storage within drainage basins. Deforestation reduces evapotranspiration by removing trees that would otherwise intercept and transpire water, leading to increased surface runoff and reduced atmospheric moisture return. Urbanisation replaces permeable surfaces with impermeable concrete and asphalt, drastically reducing infiltration and groundwater recharge while increasing rapid surface runoff. This shifts the water balance toward more outputs (runoff) and fewer stores (soil moisture, groundwater). Agricultural practices such as irrigation extract water from rivers and aquifers, reducing streamflow and groundwater stores. Conversely, reservoir construction increases surface water storage and can reduce downstream flow, fundamentally altering the natural water balance. Dam building also increases evaporation from large water surfaces. Overall, human activities tend to accelerate water movement through the system, reduce storage capacity, and create more extreme variations in the water balance components.',
  '{"type":"point_based","max_marks":6,"points":[{"marks":1,"criteria":"Identification of human activity (e.g., deforestation, urbanisation, agriculture, dam construction)"},{"marks":1,"criteria":"Explanation of impact on specific water balance component (e.g., reduced evapotranspiration)"},{"marks":1,"criteria":"Second human activity identified"},{"marks":1,"criteria":"Explanation of impact on water balance component (e.g., increased runoff, reduced infiltration)"},{"marks":1,"criteria":"Understanding of water balance equation or system interactions"},{"marks":1,"criteria":"Developed explanation showing cause-effect chains or multiple impacts"}],"notes":"Award marks for clear explanations linking human activities to changes in inputs, outputs, or stores. Look for understanding of water balance components (precipitation, evapotranspiration, runoff, storage)."}',
  '3.1.1.2 - The water cycle and water insecurity',
  NULL
),
(
  'geo-paper1-1d',
  'water-carbon-cycles',
  'Using a systems approach, explain how feedback mechanisms operate within the carbon cycle.',
  6,
  'medium',
  4,
  'Feedback mechanisms within the carbon cycle operate through interconnected stores and flows that can either amplify (positive feedback) or dampen (negative feedback) change. A key positive feedback involves ocean warming: as atmospheric CO₂ increases and global temperatures rise, ocean water warms and its capacity to dissolve CO₂ decreases. This means oceans (a major carbon store) absorb less atmospheric carbon, leaving more CO₂ in the atmosphere, further enhancing warming. Similarly, permafrost thawing creates positive feedback—warming temperatures cause frozen soils to melt, releasing stored methane and CO₂, which increases atmospheric greenhouse gases and accelerates further warming. A negative feedback example involves increased plant growth: higher atmospheric CO₂ levels can enhance photosynthesis rates, meaning terrestrial vegetation (biosphere store) sequesters more carbon from the atmosphere through increased biomass production, partially offsetting the initial CO₂ increase. These feedbacks demonstrate the carbon cycle as a dynamic system where changes in one component trigger responses in others, creating loops that either stabilise or destabilise the system.',
  '{"type":"point_based","max_marks":6,"points":[{"marks":1,"criteria":"Definition or understanding of feedback mechanism (positive or negative)"},{"marks":1,"criteria":"Example of specific feedback (e.g., ocean warming, permafrost, vegetation)"},{"marks":1,"criteria":"Explanation of how feedback operates through stores/flows"},{"marks":1,"criteria":"Second feedback example identified"},{"marks":1,"criteria":"Explanation of contrasting feedback type or mechanism"},{"marks":1,"criteria":"Systems terminology used (stores, flows, inputs, outputs) or understanding of amplification/dampening"}],"notes":"Reward use of systems approach vocabulary. Look for understanding of how changes in one component trigger changes in others. Accept various feedback examples if correctly explained."}',
  '3.1.1.3 - Carbon cycle',
  NULL
),
(
  'geo-paper1-1e',
  'water-carbon-cycles',
  'Evaluate the impacts of changing carbon stores on global climate systems.',
  20,
  'hard',
  5,
  'Changing carbon stores have profound and wide-ranging impacts on global climate systems, operating through multiple interconnected mechanisms that affect temperature, precipitation patterns, and extreme weather events. The most significant impact comes from the transfer of carbon from long-term geological stores (fossil fuels) to the atmospheric store through human combustion. This has increased atmospheric CO₂ concentrations from 280ppm pre-industrial to over 415ppm today, enhancing the greenhouse effect and driving global temperature increases of approximately 1.1°C since 1850. This warming fundamentally alters climate systems by increasing the atmosphere''s capacity to hold moisture (7% per 1°C warming), intensifying the hydrological cycle and leading to more extreme precipitation events in some regions and prolonged droughts in others.

Deforestation represents another critical store change, with tropical forests—which store 250 billion tonnes of carbon in biomass—being cleared at rates of 10 million hectares annually. This simultaneously adds CO₂ to the atmosphere and removes a major carbon sink that would otherwise sequester 2.4 billion tonnes of CO₂ annually through photosynthesis. The climate impact is amplified because forests also regulate regional rainfall patterns through evapotranspiration; their loss can trigger feedback loops leading to "savannization" and further carbon release.

Ocean carbon stores present complex impacts on climate. While oceans have absorbed approximately 25% of anthropogenic CO₂ emissions, this has caused ocean acidification (pH drop of 0.1 units), disrupting marine ecosystems and potentially reducing the ocean''s future capacity to act as a carbon sink. Warming oceans also reduce CO₂ solubility, creating a positive feedback that could accelerate atmospheric CO₂ accumulation. Additionally, changes in ocean carbon stores affect thermohaline circulation patterns, potentially disrupting major ocean currents like the Gulf Stream, with severe implications for regional climates.

Permafrost carbon stores in high-latitude regions contain an estimated 1,500 billion tonnes of carbon—more than twice the atmospheric carbon content. As climate warms, permafrost thaw releases this carbon as CO₂ and methane (which has 28 times the warming potential of CO₂ over 100 years), creating a powerful positive feedback that could trigger "runaway" warming scenarios. This represents one of the most concerning tipping points in the climate system.

However, the magnitude of impacts varies spatially and temporally. Some regions may initially experience benefits such as longer growing seasons or increased agricultural productivity in high latitudes, though these are outweighed by negative impacts globally. The rate of store change is also critical—rapid changes exceed ecosystem and societal adaptation capacities, whereas gradual changes might allow some adjustment.

In conclusion, while changing carbon stores drive multiple climate impacts through greenhouse gas forcing, precipitation changes, and ocean circulation disruption, the overall evaluation must recognise that impacts are overwhelmingly negative and accelerating. The critical factor is the speed and scale of anthropogenic transfers between stores, which exceed natural variability by orders of magnitude. The interconnected nature of climate systems means that carbon store changes trigger cascading effects and feedback loops that amplify initial warming, making mitigation of further store changes essential to preventing catastrophic climate disruption. The severity of impacts depends heavily on future emission pathways and whether we can halt the transfer of carbon from geological to atmospheric stores.',
  '{"type":"levels","levels":[{"level":4,"marks":"16-20","descriptor":"Detailed evaluative conclusion is evident throughout. Thorough knowledge and comprehensive understanding of how changing carbon stores impact climate systems. Full and accurate knowledge of stores, flows and feedback mechanisms. Connections and relationships between stores and climate impacts are fully developed with complete relevance. Argument is sustained and balanced, considering multiple spatial/temporal scales and counter-arguments. Strong synthesis of physical geography concepts."},{"level":3,"marks":"11-15","descriptor":"Clear evaluative conclusion. Clear knowledge and understanding of impacts of changing stores. Reasonable knowledge of stores, flows and feedbacks. Connections between stores and climate are clearly made. Some synthesis evident. Evaluation considers different impacts but may lack balance or full development."},{"level":2,"marks":"6-10","descriptor":"Some evaluation attempted. Some knowledge and understanding of carbon stores and climate impacts. Partial knowledge of stores/flows. Connections between stores and climate are basic. Limited synthesis. Evaluation is basic or one-sided."},{"level":1,"marks":"1-5","descriptor":"Limited evaluation. Basic knowledge of carbon stores or climate impacts. Isolated facts about stores or flows. Connections poorly developed. No real synthesis. Descriptive rather than evaluative."}],"notes":"Look for: (1) Understanding of multiple carbon stores (atmosphere, biosphere, lithosphere, hydrosphere); (2) Explanation of mechanisms linking store changes to climate (greenhouse effect, albedo, ocean circulation); (3) Examples of store changes (fossil fuel combustion, deforestation, permafrost thaw, ocean absorption); (4) Recognition of feedbacks and tipping points; (5) Evaluation considering spatial/temporal variations, magnitude of impacts, and uncertainties; (6) Balanced argument considering multiple perspectives; (7) Synthesis integrating physical geography concepts. Award highest marks for sophisticated evaluation that considers competing factors and reaches a supported conclusion."}',
  '3.1.1.1, 3.1.1.3 - Systems approach and carbon cycle',
  NULL
);