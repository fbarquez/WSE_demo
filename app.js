    const STORAGE_KEYS = {
      projects: "wseDemo.projects",
      importedAt: "wseDemo.importedAt",
      filters: "wseDemo.filters"
    };

    const defaultProjects = [
      {
        id:"DT-101", name:"HubSpot CRM Integration", topic:"CRM", owner:"DT Team",
        desc:"Integrate HubSpot CRM workflows into the global sales process.",
        dept:["Sales","Customer Service"], status:"In Progress", progress:65, priority:"High",
        deadline:"2026-06-18", updated:"2026-05-19", phase:"Now", dependency:"DT-102 Sales Dashboard",
        notes:["Sales confirmed the process flow.","Jira epic moved from Planning to In Progress.","Next milestone: validate customer handover process."]
      },
      {
        id:"DT-102", name:"Sales Dashboard", topic:"Reporting", owner:"Ryan",
        desc:"Create a visibility layer for sales KPIs, initiatives and deadlines.",
        dept:["Sales","C-Suite"], status:"At Risk", progress:42, priority:"Critical",
        deadline:"2026-06-12", updated:"2026-05-18", phase:"Now", dependency:"DT-103 Planner Export Automation",
        notes:["Marked as at risk because Planner/Jira export structure is not final.","C-Suite needs simple KPI cards.","Stakeholders asked for department-specific filters."]
      },
      {
        id:"DT-103", name:"Planner Export Automation", topic:"Data", owner:"Anna",
        desc:"Prepare automated exports from Microsoft Planner or Jira into a normalized project structure.",
        dept:["Sales","Operations","Engineering"], status:"Planning", progress:25, priority:"High",
        deadline:"2026-07-05", updated:"2026-05-16", phase:"Next", dependency:"Jira field mapping",
        notes:["CSV is sufficient for MVP.","Jira REST API can be added later.","Important for realistic future integration."]
      },
      {
        id:"DT-104", name:"Customer Portal", topic:"Service", owner:"Nicolas",
        desc:"Self-service portal for customer requests and support status.",
        dept:["Customer Service","Sales","Marketing"], status:"Planning", progress:15, priority:"Medium",
        deadline:"2026-08-15", updated:"2026-05-17", phase:"Next", dependency:"Customer Journey Workshop",
        notes:["Customer Service needs early visibility.","Marketing wants launch timeline.","Sales wants impact on customer communication."]
      },
      {
        id:"DT-105", name:"ERP Migration", topic:"Operations", owner:"Gianluca",
        desc:"Migrate legacy ERP workflows and connect them with reporting processes.",
        dept:["Operations","C-Suite","Engineering"], status:"At Risk", progress:31, priority:"High",
        deadline:"2026-09-03", updated:"2026-05-15", phase:"Later", dependency:"DT-103 Planner Export Automation",
        notes:["Dependencies are not fully visible today.","Operations needs cross-team roadmap.","This is a good example for dependency visualization."]
      },
      {
        id:"DT-106", name:"Global Reporting Tool", topic:"Reporting", owner:"Khanh",
        desc:"Consolidated reporting view for global initiatives and management summaries.",
        dept:["C-Suite","Operations"], status:"Hypercare", progress:88, priority:"Medium",
        deadline:"2026-06-28", updated:"2026-05-14", phase:"Done", dependency:"None",
        notes:["Useful for C-Suite view.","Can serve as template for executive reports.","Needs last-updated timestamp."]
      },
      {
        id:"DT-107", name:"Marketing Automation Setup", topic:"Marketing", owner:"Linh",
        desc:"Automation for campaign workflows and lead handover from marketing to sales.",
        dept:["Marketing","Sales"], status:"In Progress", progress:54, priority:"High",
        deadline:"2026-06-24", updated:"2026-05-20", phase:"Now", dependency:"DT-101 HubSpot CRM Integration",
        notes:["Marketing and Sales need shared visibility.","Dependency to HubSpot has been added.","Deadline moved after stakeholder feedback."]
      },
      {
        id:"DT-108", name:"Digital Service Request Intake", topic:"Process", owner:"Fernando",
        desc:"Standardize how departments request digitalization support.",
        dept:["Sales","Marketing","Customer Service","Operations"], status:"In Progress", progress:73, priority:"Critical",
        deadline:"2026-06-10", updated:"2026-05-20", phase:"Now", dependency:"None",
        notes:["This project affects almost every department.","A simple intake overview reduces email/call coordination.","Good candidate for demo story."]
      },
      {
        id:"DT-109", name:"Warehouse Scan App", topic:"Mobile", owner:"Engineering",
        desc:"Mobile scanning workflow for warehouse and logistics operations.",
        dept:["Operations","Engineering"], status:"Done", progress:100, priority:"Low",
        deadline:"2026-05-28", updated:"2026-05-10", phase:"Done", dependency:"None",
        notes:["Completed project still useful in roadmap history.","Shows value delivered by DT.","Can be hidden in department view if not relevant."]
      },
      {
        id:"DT-110", name:"Customer Newsletter Redesign", topic:"Communication", owner:"Marketing",
        desc:"Update newsletter templates and campaign approval workflow.",
        dept:["Marketing","Sales"], status:"Planning", progress:8, priority:"Medium",
        deadline:"2026-08-30", updated:"2026-05-13", phase:"Later", dependency:"DT-107 Marketing Automation Setup",
        notes:["Not urgent, but related to automation project.","Marketing needs timeline visibility.","Sales wants to know launch timing."]
      }
    ];

    let changes = [
      {id:"DT-108", icon:"+", title:"Digital Service Request Intake added", desc:"New cross-department initiative added to roadmap.", date:"Today 10:25"},
      {id:"DT-107", icon:"⛓", title:"Marketing Automation dependency added", desc:"Now depends on HubSpot CRM Integration.", date:"Today 09:10"},
      {id:"DT-102", icon:"!", title:"Sales Dashboard marked as At Risk", desc:"Jira/Planner export structure is still unclear.", date:"Yesterday 16:20"},
      {id:"DT-101", icon:"↗", title:"HubSpot CRM moved to In Progress", desc:"Sales stakeholders confirmed requirements.", date:"18 May"},
      {id:"DT-105", icon:"⛓", title:"ERP Migration dependency visible", desc:"Linked to Planner Export Automation.", date:"17 May"},
      {id:"DT-106", icon:"✓", title:"Global Reporting moved to Hypercare", desc:"Executive reporting prototype validated.", date:"16 May"}
    ];

    const els = {
      department: document.getElementById("department"),
      status: document.getElementById("status"),
      priority: document.getElementById("priority"),
      deadline: document.getElementById("deadline"),
      search: document.getElementById("search"),
      rows: document.getElementById("projectRows"),
      changes: document.getElementById("changesList"),
      toast: document.getElementById("toast"),
      csvFileInput: document.getElementById("csvFileInput"),
      syncTime: document.getElementById("syncTime"),
      sourceTitle: document.getElementById("sourceTitle"),
      sourceType: document.getElementById("sourceType")
    };

    const storedProjects = loadStoredProjects();
    let projects = storedProjects || defaultProjects;
    if(storedProjects) changes = importedChanges(storedProjects);

    function today(){ return new Date(); }
    function daysUntil(dateString){
      return Math.ceil((new Date(dateString + "T00:00:00") - today()) / 86400000);
    }
    function dateLabel(dateString){
      return new Date(dateString + "T00:00:00").toLocaleDateString("en-GB", {day:"2-digit", month:"short"});
    }
    function badge(value){
      let cls = "gray";
      if(["At Risk","Critical"].includes(value)) cls = "red";
      if(["Planning","Sales","Engineering"].includes(value)) cls = "blue";
      if(["Done","Hypercare","Operations"].includes(value)) cls = "green";
      if(["High","Marketing"].includes(value)) cls = "amber";
      if(["In Progress","Customer Service","C-Suite"].includes(value)) cls = "purple";
      return `<span class="badge ${cls}">${escapeHtml(value)}</span>`;
    }

    function escapeHtml(value){
      return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&":"&amp;",
        "<":"&lt;",
        ">":"&gt;",
        "\"":"&quot;",
        "'":"&#39;"
      }[char]));
    }

    function attr(value){
      return escapeHtml(value);
    }

    function saveFilters(){
      localStorage.setItem(STORAGE_KEYS.filters, JSON.stringify({
        department: els.department.value,
        status: els.status.value,
        priority: els.priority.value,
        deadline: els.deadline.value,
        search: els.search.value
      }));
    }

    function restoreFilters(){
      try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.filters) || "{}");
        if(saved.department) els.department.value = saved.department;
        if(saved.status) els.status.value = saved.status;
        if(saved.priority) els.priority.value = saved.priority;
        if(saved.deadline) els.deadline.value = saved.deadline;
        if(saved.search) els.search.value = saved.search;
      } catch {
        localStorage.removeItem(STORAGE_KEYS.filters);
      }
    }

    function loadStoredProjects(){
      try {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.projects) || "null");
        return Array.isArray(stored) && stored.length ? stored : null;
      } catch {
        localStorage.removeItem(STORAGE_KEYS.projects);
        return null;
      }
    }

    function updateSourceCard(){
      const importedAt = localStorage.getItem(STORAGE_KEYS.importedAt);
      if(importedAt){
        els.sourceTitle.textContent = "Imported CSV data";
        els.sourceType.textContent = "Browser-loaded Jira-like CSV";
        els.syncTime.textContent = new Date(importedAt).toLocaleString("en-GB", {
          day:"2-digit",
          month:"short",
          year:"numeric",
          hour:"2-digit",
          minute:"2-digit"
        });
      }
    }

    function filtered(){
      const dep = els.department.value;
      const st = els.status.value;
      const pr = els.priority.value;
      const dl = els.deadline.value;
      const q = els.search.value.trim().toLowerCase();

      return projects.filter(p => {
        const depOk = dep === "All" || p.dept.includes(dep);
        const stOk = st === "All" || p.status === st;
        const prOk = pr === "All" || p.priority === pr;
        const remainingDays = daysUntil(p.deadline);
        const dlOk = dl === "All" || (remainingDays >= 0 && remainingDays <= Number(dl));
        const qOk = !q || [p.id,p.name,p.desc,p.owner,p.topic].some(v => v.toLowerCase().includes(q));
        return depOk && stOk && prOk && dlOk && qOk;
      });
    }

    function render(){
      const list = filtered();
      const dlWindow = els.deadline.value === "All" ? 999 : Number(els.deadline.value);

      document.getElementById("kpiProjects").textContent = list.length;
      document.getElementById("kpiRisk").textContent = list.filter(p => p.status === "At Risk").length;
      document.getElementById("kpiDeadlines").textContent = list.filter(p => {
        const remainingDays = daysUntil(p.deadline);
        return remainingDays >= 0 && remainingDays <= dlWindow;
      }).length;
      document.getElementById("kpiDeps").textContent = list.filter(p => p.dependency && p.dependency !== "None").length;
      document.getElementById("kpiUpdated").textContent = list.filter(p => daysUntil(p.updated) >= -14).length;

      const counts = {
        Planning: list.filter(p => p.status === "Planning").length,
        "In Progress": list.filter(p => p.status === "In Progress").length,
        "At Risk": list.filter(p => p.status === "At Risk").length,
        Done: list.filter(p => ["Done","Hypercare"].includes(p.status)).length
      };
      const max = Math.max(1, ...Object.values(counts));

      document.getElementById("countPlanning").textContent = counts.Planning;
      document.getElementById("countProgress").textContent = counts["In Progress"];
      document.getElementById("countRisk").textContent = counts["At Risk"];
      document.getElementById("countDone").textContent = counts.Done;

      document.getElementById("barPlanning").style.height = `${Math.max(12, counts.Planning/max*112)}px`;
      document.getElementById("barProgress").style.height = `${Math.max(12, counts["In Progress"]/max*112)}px`;
      document.getElementById("barRisk").style.height = `${Math.max(12, counts["At Risk"]/max*112)}px`;
      document.getElementById("barDone").style.height = `${Math.max(12, counts.Done/max*112)}px`;

      const titleDepartment = els.department.value === "All" ? "all departments" : els.department.value;
      document.getElementById("tableTitle").textContent = `Projects for ${titleDepartment}`;

      els.rows.innerHTML = list.map(p => `
        <tr class="project-row" data-project-id="${attr(p.id)}">
          <td>
            <div class="project-name">${escapeHtml(p.name)}</div>
            <div class="project-meta">${escapeHtml(p.id)} · ${escapeHtml(p.owner)} · ${escapeHtml(p.topic)}</div>
          </td>
          <td>${p.dept.slice(0,2).map(badge).join("")}</td>
          <td>${badge(p.status)}</td>
          <td>${dateLabel(p.deadline)}</td>
          <td><div class="progress-mini"><span class="track"><div style="width:${p.progress}%"></div></span>${p.progress}%</div></td>
        </tr>
      `).join("") || `<tr><td colspan="5" style="text-align:center;color:#777;padding:30px;">No projects match the current filters</td></tr>`;

      renderChanges(list);
      renderRoadmap(list);
      renderInsights(list);
    }

    function renderChanges(list){
      const ids = new Set(list.map(p => p.id));
      const relevant = changes.filter(c => ids.has(c.id));

      els.changes.innerHTML = relevant.slice(0,5).map(c => `
        <div class="change" data-project-id="${attr(c.id)}">
          <div class="change-icon">${escapeHtml(c.icon)}</div>
          <div>
            <div class="change-title">${escapeHtml(c.title)}</div>
            <div class="change-desc">${escapeHtml(c.desc)}</div>
            <div class="change-date">${escapeHtml(c.date)}</div>
          </div>
        </div>
      `).join("") || `
        <div class="change">
          <div class="change-icon">–</div>
          <div><div class="change-title">No recent developments</div><div class="change-desc">Try another filter or department.</div></div>
        </div>
      `;
    }

    function renderRoadmap(list){
      const phaseMap = {Now:"phaseNow", Next:"phaseNext", Later:"phaseLater", Done:"phaseDone"};
      Object.values(phaseMap).forEach(id => document.getElementById(id).innerHTML = "");

      Object.entries(phaseMap).forEach(([phase,id]) => {
        const phaseProjects = list.filter(p => p.phase === phase || (phase === "Done" && ["Done","Hypercare"].includes(p.status)));
        document.getElementById(id).innerHTML = phaseProjects.slice(0,3).map(p => `
          <div class="road-item" data-project-id="${attr(p.id)}">
            <strong>${escapeHtml(p.name)}</strong>
            <span>${escapeHtml(p.id)} · ${escapeHtml(p.status)} · ${escapeHtml(p.priority)} · ${dateLabel(p.deadline)}</span>
          </div>
        `).join("") || `<div class="road-item"><strong>No projects</strong><span>No matching items</span></div>`;
      });
    }

    function renderInsights(list){
      const dep = els.department.value === "All" ? "selected view" : els.department.value;
      const risk = list.filter(p => p.status === "At Risk");
      const nextDeadline = [...list].sort((a,b) => new Date(a.deadline) - new Date(b.deadline))[0];
      const deps = list.filter(p => p.dependency && p.dependency !== "None");

      document.getElementById("insights").innerHTML = `
        <div class="insight"><strong>${escapeHtml(dep)} focus</strong><span>${list.length} visible project(s). This view shows only relevant roadmap items.</span></div>
        <div class="insight"><strong>Attention needed</strong><span>${risk.length ? `${risk.length} project(s) are at risk: ${escapeHtml(risk.map(p=>p.name).slice(0,2).join(", "))}.` : "No at-risk projects in this view."}</span></div>
        <div class="insight"><strong>Next deadline</strong><span>${nextDeadline ? `${escapeHtml(nextDeadline.name)} is due on ${dateLabel(nextDeadline.deadline)}.` : "No deadline visible."}</span></div>
        <div class="insight"><strong>Dependencies</strong><span>${deps.length ? `${deps.length} project(s) depend on another initiative or data source.` : "No dependencies in this view."}</span></div>
      `;
    }

    function openProject(id){
      const p = projects.find(x => x.id === id);
      if(!p) return;

      document.getElementById("modalTitle").textContent = `${p.id} · ${p.name}`;
      document.getElementById("modalSub").textContent = p.desc;

      document.getElementById("detailGrid").innerHTML = `
        <div class="detail"><label>Owner</label><div>${escapeHtml(p.owner)}</div></div>
        <div class="detail"><label>Status</label><div>${badge(p.status)}</div></div>
        <div class="detail"><label>Progress</label><div>${p.progress}%</div></div>
        <div class="detail"><label>Departments</label><div>${escapeHtml(p.dept.join(", "))}</div></div>
        <div class="detail"><label>Deadline</label><div>${dateLabel(p.deadline)}</div></div>
        <div class="detail"><label>Priority</label><div>${badge(p.priority)}</div></div>
        <div class="detail"><label>Dependency</label><div>${escapeHtml(p.dependency)}</div></div>
        <div class="detail"><label>Last updated</label><div>${dateLabel(p.updated)}</div></div>
        <div class="detail"><label>Source</label><div>Jira CSV Export</div></div>
      `;

      const phases = ["Planning","In Progress","At Risk","Hypercare / Done"];
      document.getElementById("timeline").innerHTML = phases.map(ph => {
        const active = (ph === p.status) || (ph === "Hypercare / Done" && ["Hypercare","Done"].includes(p.status));
        return `<div class="phase ${active ? "active" : ""}">${ph}</div>`;
      }).join("");

      document.getElementById("notes").innerHTML = p.notes.map(n => `<div class="note">${escapeHtml(n)}</div>`).join("");
      document.getElementById("projectModal").classList.add("open");
    }

    function toast(text){
      const t = document.getElementById("toast");
      t.textContent = text;
      t.classList.add("show");
      setTimeout(() => t.classList.remove("show"), 2600);
    }

    document.querySelectorAll("select,input").forEach(el => {
      if(el.type === "file") return;
      el.addEventListener("input", () => {
        saveFilters();
        render();
      });
    });

    document.addEventListener("click", e => {
      const projectLink = e.target.closest("[data-project-id]");
      if(projectLink) openProject(projectLink.dataset.projectId);
    });

    document.querySelectorAll("[data-view]").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll("[data-view]").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const view = btn.dataset.view;

        if(view === "c-suite"){
          els.department.value = "C-Suite";
          els.priority.value = "All";
          els.status.value = "All";
        }

        if(view === "department"){
          els.department.value = "Sales";
          els.priority.value = "All";
          els.status.value = "All";
        }

        if(view === "progress"){
          els.department.value = "All";
          els.status.value = "In Progress";
          els.priority.value = "All";
        }

        if(view === "priority"){
          els.department.value = "All";
          els.status.value = "All";
          els.priority.value = "High";
        }

        saveFilters();
        render();
        toast(`View changed to ${btn.textContent}`);
      });
    });

    document.getElementById("resetFilters").addEventListener("click", () => {
      els.department.value = "Sales";
      els.status.value = "All";
      els.priority.value = "All";
      els.deadline.value = "30";
      els.search.value = "";
      document.querySelectorAll("[data-view]").forEach(b => b.classList.remove("active"));
      document.querySelector('[data-view="department"]').classList.add("active");
      saveFilters();
      render();
      toast("Filters reset to Department view.");
    });

    document.getElementById("showRelevantChanges").addEventListener("click", () => {
      els.status.value = "All";
      els.priority.value = "All";
      saveFilters();
      render();
      toast("Showing relevant changes for the current view.");
    });

    document.getElementById("exportBtn").addEventListener("click", () => {
      const list = filtered();
      const header = ["issue_key","summary","assignee","departments","status","progress","priority","due_date","linked_issues"];
      const csv = [header, ...list.map(p => [p.id,p.name,p.owner,p.dept.join(";"),p.status,p.progress,p.priority,p.deadline,p.dependency])]
        .map(row => row.map(cell => `"${String(cell).replaceAll('"','""')}"`).join(",")).join("\n");

      const blob = new Blob([csv], {type:"text/csv"});
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "starteam_jira_like_export.csv";
      a.click();
      URL.revokeObjectURL(url);
      toast("CSV export generated from the current filtered view.");
    });

    document.getElementById("uploadBtn").addEventListener("click", () => {
      document.getElementById("uploadModal").classList.add("open");
    });

    document.getElementById("uploadArea").addEventListener("click", () => {
      els.csvFileInput.click();
    });

    els.csvFileInput.addEventListener("change", e => {
      const file = e.target.files[0];
      if(!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        try {
          projects = parseProjectsCsv(String(reader.result));
          changes = importedChanges(projects);
          localStorage.setItem(STORAGE_KEYS.projects, JSON.stringify(projects));
          localStorage.setItem(STORAGE_KEYS.importedAt, new Date().toISOString());
          updateSourceCard();
          document.getElementById("uploadModal").classList.remove("open");
          render();
          toast(`${projects.length} project(s) imported from ${file.name}.`);
        } catch (error) {
          toast(error.message || "Could not import the CSV file.");
        } finally {
          els.csvFileInput.value = "";
        }
      };
      reader.readAsText(file);
    });

    document.getElementById("closeProject").addEventListener("click", () => document.getElementById("projectModal").classList.remove("open"));
    document.getElementById("closeUpload").addEventListener("click", () => document.getElementById("uploadModal").classList.remove("open"));

    document.getElementById("projectModal").addEventListener("click", e => {
      if(e.target.id === "projectModal") e.currentTarget.classList.remove("open");
    });

    document.getElementById("uploadModal").addEventListener("click", e => {
      if(e.target.id === "uploadModal") e.currentTarget.classList.remove("open");
    });

    function parseProjectsCsv(csvText){
      const rows = parseCsv(csvText).filter(row => row.some(cell => cell.trim()));
      if(rows.length < 2) throw new Error("CSV needs a header row and at least one project.");

      const headers = rows[0].map(normalizeHeader);
      const dataRows = rows.slice(1);

      return dataRows.map((row, index) => {
        const record = {};
        headers.forEach((header, i) => record[header] = (row[i] || "").trim());

        const id = valueFor(record, ["issue_key","issue","key","id"]) || `CSV-${index + 1}`;
        const name = valueFor(record, ["summary","name","title"]) || "Untitled project";
        const status = normalizeStatus(valueFor(record, ["status"]) || "Planning");
        const priority = normalizePriority(valueFor(record, ["priority"]) || "Medium");
        const deadline = normalizeDate(valueFor(record, ["due_date","duedate","deadline","target_date"]));
        const updated = normalizeDate(valueFor(record, ["updated","last_updated","lastupdated"]) || new Date().toISOString().slice(0,10));
        const dept = splitList(valueFor(record, ["departments","department","labels","teams"]));

        return {
          id,
          name,
          topic: valueFor(record, ["topic","component","category"]) || "Imported",
          owner: valueFor(record, ["assignee","owner","lead"]) || "Unassigned",
          desc: valueFor(record, ["description","desc"]) || `Imported Jira issue ${id}.`,
          dept: dept.length ? dept : ["Sales"],
          status,
          progress: clamp(Number(valueFor(record, ["progress","percent","completion"]) || progressFromStatus(status)), 0, 100),
          priority,
          deadline,
          updated,
          phase: valueFor(record, ["phase","roadmap_phase"]) || phaseFromStatus(status, deadline),
          dependency: valueFor(record, ["linked_issues","linkedissues","dependency","dependencies"]) || "None",
          notes: splitList(valueFor(record, ["notes","comments"])).length ? splitList(valueFor(record, ["notes","comments"])) : ["Imported from CSV."]
        };
      });
    }

    function parseCsv(text){
      const rows = [];
      let row = [];
      let cell = "";
      let inQuotes = false;

      for(let i = 0; i < text.length; i++){
        const char = text[i];
        const next = text[i + 1];

        if(char === '"' && inQuotes && next === '"'){
          cell += '"';
          i++;
        } else if(char === '"'){
          inQuotes = !inQuotes;
        } else if(char === "," && !inQuotes){
          row.push(cell);
          cell = "";
        } else if((char === "\n" || char === "\r") && !inQuotes){
          if(char === "\r" && next === "\n") i++;
          row.push(cell);
          rows.push(row);
          row = [];
          cell = "";
        } else {
          cell += char;
        }
      }

      row.push(cell);
      rows.push(row);
      return rows;
    }

    function normalizeHeader(header){
      return header.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
    }

    function valueFor(record, keys){
      return keys.map(key => record[key]).find(Boolean) || "";
    }

    function splitList(value){
      return String(value || "").split(/[;|]/).map(item => item.trim()).filter(Boolean);
    }

    function normalizeDate(value){
      if(!value) return new Date().toISOString().slice(0,10);
      const parsed = new Date(value);
      if(Number.isNaN(parsed.getTime())) throw new Error(`Invalid date in CSV: ${value}`);
      return parsed.toISOString().slice(0,10);
    }

    function normalizeStatus(value){
      const status = String(value).trim().toLowerCase();
      if(status.includes("risk") || status.includes("block")) return "At Risk";
      if(status.includes("progress") || status.includes("doing")) return "In Progress";
      if(status.includes("hyper")) return "Hypercare";
      if(status.includes("done") || status.includes("complete")) return "Done";
      return "Planning";
    }

    function normalizePriority(value){
      const priority = String(value).trim().toLowerCase();
      if(priority.includes("critical")) return "Critical";
      if(priority.includes("high")) return "High";
      if(priority.includes("low")) return "Low";
      return "Medium";
    }

    function progressFromStatus(status){
      return {Planning:15, "In Progress":55, "At Risk":35, Hypercare:88, Done:100}[status] || 0;
    }

    function phaseFromStatus(status, deadline){
      if(["Done","Hypercare"].includes(status)) return "Done";
      const remainingDays = daysUntil(deadline);
      if(remainingDays <= 30) return "Now";
      if(remainingDays <= 90) return "Next";
      return "Later";
    }

    function clamp(value, min, max){
      return Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));
    }

    function importedChanges(importedProjects){
      return importedProjects.slice(0,6).map(project => ({
        id: project.id,
        icon: "+",
        title: `${project.name} imported`,
        desc: `${project.status} project loaded from CSV.`,
        date: "Imported now"
      }));
    }

    restoreFilters();
    updateSourceCard();
    render();
