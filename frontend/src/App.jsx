import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import AIAssistant from './pages/AIAssistant';
import CostEstimator from './pages/CostEstimator';
import CostSummary from './pages/CostSummary';
import PlanMyHouse from './pages/PlanMyHouse';
import HousePlanResult from './pages/HousePlanResult';
import ExteriorDesign from './pages/ExteriorDesign';
import InteriorDesign from './pages/InteriorDesign';
import HouseCostEstimate from './pages/HouseCostEstimate';
import BudgetComparison from './pages/BudgetComparison';
import MaterialPriceManager from './pages/MaterialPriceManager';

// Services
import { materialService, projectService, estimateService } from './services/api';
import { INITIAL_MATERIALS, INITIAL_PROJECT } from './services/mockData';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [project, setProject] = useState(INITIAL_PROJECT);
  const [materialPrices, setMaterialPrices] = useState(INITIAL_MATERIALS);
  const [planData, setPlanData] = useState(null);
  const [estimateData, setEstimateData] = useState(null);

  // Baseline calculated material costs for default project (₹)
  const [materialCosts, setMaterialCosts] = useState({
    cement: 355500,     // 900 bags @ ~395
    steel: 544000,      // 8000 kg @ ~68
    bricks: 285000,     // 30,000 bricks @ ~9.5
    tiles: 187200,      // 2880 sq.ft @ ~65
    pipes: 74000,       // 400 m @ ~185
    electrical: 185000, // Modular pack
    plumbing: 145000,   // Sanitary & CP pack
    paint: 129600,      // 360 L @ ~360
    sand: 197200,       // 3400 cu.ft @ ~58
    aggregates: 179400  // 3900 cu.ft @ ~46
  });

  // Load project and prices on initial mount
  useEffect(() => {
    async function loadInitialData() {
      try {
        const prices = await materialService.getMaterialPrices();
        if (prices && prices.length > 0) setMaterialPrices(prices);

        const currentProject = await projectService.getProject(101);
        if (currentProject) setProject(currentProject);
      } catch (e) {
        console.warn('Backend loading deferred to local fallback.', e);
      }
    }
    loadInitialData();
  }, []);

  const totalMaterialCost = Object.values(materialCosts).reduce(
    (acc, curr) => acc + (Number(curr) || 0),
    0
  );

  return (
    <div className="app-layout">
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        activeProject={project}
      />

      <main className="main-content">
        {activePage === 'home' && (
          <Home
            setActivePage={setActivePage}
            project={project}
            totalMaterialCost={totalMaterialCost}
          />
        )}

        {activePage === 'ai-assistant' && (
          <AIAssistant
            project={project}
            materialCosts={materialCosts}
          />
        )}

        {activePage === 'cost-estimator' && (
          <CostEstimator
            materialCosts={materialCosts}
            setMaterialCosts={setMaterialCosts}
            materialPrices={materialPrices}
            setActivePage={setActivePage}
          />
        )}

        {activePage === 'cost-summary' && (
          <CostSummary
            materialCosts={materialCosts}
            setActivePage={setActivePage}
            project={project}
          />
        )}

        {activePage === 'plan-my-house' && (
          <PlanMyHouse
            project={project}
            setProject={setProject}
            setActivePage={setActivePage}
            setPlanData={setPlanData}
          />
        )}

        {activePage === 'house-plan-result' && (
          <HousePlanResult
            project={project}
            setProject={setProject}
            planData={planData}
            setActivePage={setActivePage}
          />
        )}

        {activePage === 'exterior-design' && (
          <ExteriorDesign
            project={project}
            setActivePage={setActivePage}
          />
        )}

        {activePage === 'interior-design' && (
          <InteriorDesign
            project={project}
            setActivePage={setActivePage}
          />
        )}

        {activePage === 'house-cost-estimate' && (
          <HouseCostEstimate
            project={project}
            setActivePage={setActivePage}
            setEstimateData={setEstimateData}
          />
        )}

        {activePage === 'budget-comparison' && (
          <BudgetComparison
            project={project}
            estimateData={estimateData}
            setActivePage={setActivePage}
          />
        )}

        {activePage === 'material-prices' && (
          <MaterialPriceManager
            materialPrices={materialPrices}
            setMaterialPrices={setMaterialPrices}
            setActivePage={setActivePage}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
