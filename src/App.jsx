import { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════
//  CONSTANTS & DATA
// ═══════════════════════════════════════════════
const PROVADATE = "2025-09-15";
const DAILY_GOAL = 80;
const SL = { nao_estudado:"Não estudado", em_andamento:"Em andamento", concluido:"Concluído" };
const SC = { nao_estudado:"#94a3b8", em_andamento:"#f59e0b", concluido:"#10b981" };
const AC = { "Clínica Médica":"#3b82f6","Clínica Cirúrgica":"#10b981","Pediatria":"#f59e0b","Ginecologia e Obstetrícia":"#ec4899","Preventiva & Social":"#8b5cf6" };
const PC = { Alta:"#ef4444", Média:"#f59e0b", Baixa:"#6b7280" };
const AREAS = ["Clínica Médica","Clínica Cirúrgica","Pediatria","Ginecologia e Obstetrícia","Preventiva & Social"];

const PO = ["Asma & DPOC","Cirurgia do Aparelho Digestivo - Pâncreas & Cólon","Hérnias","Medicina Legal","Contracepção & Infertilidade","Hemorragia Digestiva & Doenças Anorificiais","Cirurgia Pediátrica - Torácica","Glomerulopatias & Tubulopatias","Trauma Torácico & Outros","Abdome Agudo","SUS & Políticas Públicas","Dor Torácica","Trauma - Avaliação inicial","Sepse & Infecções Relacionadas à Assistência à Saúde","Distúrbios do Ritmo","Diarreia & Constipação & Dor Abdominal","Infectologia Pediátrica","Trauma - Queimadura & Populações Especiais","Cirurgia do Aparelho Digestivo - Estômago","Hipoxemia","Obesidade","Artrites","Distúrbios Hidroeletrolíticos & Ácido-Base","Epidemiologia","Doenças Exantemáticas","Anemias Hemolíticas","Medicina Baseada em Evidências","Puericultura","Trauma - Abdominal & Pélvico","Anemias Carenciais","Vacinação","Vias Biliares","Geriatria","Complicações Agudas do Diabetes Mellitus","Hipertensão Arterial Sistêmica & Dislipidemia","Menopausa","Trauma - TCE","Arboviroses","Hipertensão & Diabetes & Outras Doenças na Gestação","Complicações Cirúrgicas","Hipófise & Tireoide & Adrenal","Mama","Oncoginecologia","Insuficiência Renal","Cefaleias e Algias Cranianas","Doenças Valvares","AVC","Infecções Respiratórias","Infectologia Brasileira","Insuficiência Cardíaca","Atenção Primária","HIV e Infecções Oportunistas","Triagem Neonatal & Síndromes e Doenças Genéticas","Cuidados Pós-Natais","Neurologia","Sangramento Uterino Anormal","Sangramentos na Gestação","Intercorrências no Parto","Insuficiência Hepática","Oncohematologia","Cabeça e Pescoço","Doenças Vasculares","Exposições Ambientais","Distúrbios da Hemostasia","Pré-Natal","Parto","Puerpério","Lesões Hepáticas","Reumatologia Pediátrica","Colagenoses","Tuberculose","Infecções de Pele e Partes Moles","Síndromes Demenciais","Ortopedia","Cirurgia do Aparelho Digestivo - Esôfago","Neurologia Pediátrica","Dermatologia","Psiquiatria","Outras Hepatopatias","Outras Pneumopatias","Urologia","Neoplasias Urológicas","Fraturas","Infecções Congênitas","Infecções na Gestação","Hepatites","Cirurgia Torácica","Prematuridade","Desconforto Respiratório do RN","Princípios de Cirurgia","Parasitoses","Infecções de Vias Aéreas Superiores","Infecções do SNC","Doenças do Metabolismo Ósseo","Cirurgia Pediátrica - Gastrointestinal","Cirurgia Pediátrica - Urológica","Ortopedia Pediátrica","Outras Infecções","Vasculites","Vertigem","Otorrinolaringologia","Oftalmologia","Micologia","Farmacodermias","Dermatoses Infecciosas","Antibióticos","Anestesiologia","Alergologia","Amenorreia Primária","Amenorreia Secundária","Reações Transfusionais","Hebiatria","Câncer de Pele","Transtornos do Movimento","Cirurgia Plástica","Diabetes Mellitus Tipo 1","Diabetes Mellitus Tipo 2","Complicações Crônicas do Diabetes Mellitus"];

const MR = [
{n:"Abdome Agudo",a:"Clínica Cirúrgica",t:["Apendicite","Doença Diverticular","Diverticulite","Pancreatite Aguda","Abdome Agudo Obstrutivo","Abdome Agudo Perfurativo","Abdome Agudo Vascular"]},
{n:"Alergologia",a:"Clínica Médica",t:["Hipersensibilidade","Sistema Imune","Rinite Alérgica","Urticária","Anafilaxia","Alergia Alimentar","Dermatite Atópica"]},
{n:"Amenorreia Primária",a:"Ginecologia e Obstetrícia",t:["Fisiologia Menstrual","Deficiência Isolada de GnRH","Anomalias Uterovaginais","Avaliação da Amenorreia Primária","Síndrome de Turner","Síndrome Pré-Menstrual","Deficiências Androgênicas e Endocrinopatias"]},
{n:"Amenorreia Secundária",a:"Ginecologia e Obstetrícia",t:["Aderências Intrauterinas","Insuficiência Ovariana Primária","Avaliação da Amenorreia Secundária","Amenorreia Hipotalâmica Funcional","Síndrome dos Ovários Policísticos","Hiperprolactinemia"]},
{n:"Anemias Carenciais",a:"Clínica Médica",t:["Conceitos Gerais de Anemia","Anemia Ferropriva no Adulto e na Criança","Anemia da Doença Crônica","Anemia Megaloblástica"]},
{n:"Anemias Hemolíticas",a:"Clínica Médica",t:["Anemia Sideroblástica","Anemias Autoimunes","Esferocitose Hereditária","Deficiência de G6PD","Introdução às Hemoglobinopatias","Talassemias","Doença Falciforme","Porfirias","Hemoglobinúria Paroxística Noturna"]},
{n:"Anestesiologia",a:"Clínica Cirúrgica",t:["Anestesia Geral","Anestesia Neuroaxial","Anestesia Local","Sequência Rápida de Intubação"]},
{n:"Antibióticos",a:"Clínica Médica",t:["Carbapenêmicos e Monobactâmicos","Cefalosporinas","Lincosamidas","Macrolídeos","Penicilinas"]},
{n:"Arboviroses",a:"Clínica Médica",t:["Dengue","Chikungunya","Zika","Febre Amarela","Febre Oropouche","Febre do Mayaro"]},
{n:"Artrites",a:"Clínica Médica",t:["Artrite Reumatoide","Espondiloartrites","Artrite Psoriásica","Osteoartrite","Artrite Séptica","Gota"]},
{n:"Asma & DPOC",a:"Clínica Médica",t:["Manejo Ambulatorial da Asma","Exacerbação da Asma","DPOC – Definição e Fisiopatologia","DPOC – Diagnóstico e Tratamento","DPOC – Exacerbações","Aspergilose Broncopulmonar Alérgica"]},
{n:"Atenção Primária",a:"Preventiva & Social",t:["Prevenção e Promoção da Saúde","Atributos da APS","Projeto Terapêutico Singular","Política Nacional de Atenção Básica","Abordagem Familiar e Comunitária","Método Clínico Centrado na Pessoa"]},
{n:"AVC",a:"Clínica Médica",t:["AVC — Epidemiologia e Patogênese","AVC — Escalas e Neuroimagem","Manejo do AVC isquêmico","Hemorragia Subaracnoide","Hemorragia Intraventricular e Intracerebral"]},
{n:"Cabeça e Pescoço",a:"Clínica Cirúrgica",t:["Nódulos Tireoidianos","Câncer de Tireoide","Tireoidectomia","Nódulos Cervicais","Câncer de Cabeça e Pescoço"]},
{n:"Câncer de Pele",a:"Clínica Médica",t:["Carcinoma Basocelular","Carcinoma Espinocelular","Melanoma"]},
{n:"Cefaleias e Algias Cranianas",a:"Clínica Médica",t:["Cefaleia do Tipo Tensão","Cefaleias - Migrânea","Cefaleias - Trigêmino-Autonômicas","Cefaleia Cervicogênica","Cefaleia Hípnica","Neuralgia do Trigêmeo","Hipertensão Intracraniana Idiopática"]},
{n:"Cirurgia do Aparelho Digestivo - Esôfago",a:"Clínica Cirúrgica",t:["Esôfago de Barrett","Esofagites","Disfagia","Acalásia","Megaesôfago & Megacólon Chagásico","Divertículos Esofágicos","Câncer de Esôfago"]},
{n:"Cirurgia do Aparelho Digestivo - Estômago",a:"Clínica Cirúrgica",t:["Doença do Refluxo Gastroesofágico","Refluxo Gastroesofágico na Criança","H. pylori","Câncer de Estômago","Úlcera Péptica","Inibidores da Bomba de Prótons"]},
{n:"Cirurgia do Aparelho Digestivo - Pâncreas & Cólon",a:"Clínica Cirúrgica",t:["Câncer Colorretal","Câncer de Pâncreas Exócrino","Tumores Císticos do Pâncreas","Tumores Neuroendócrinos"]},
{n:"Cirurgia Pediátrica - Gastrointestinal",a:"Pediatria",t:["Divertículo de Meckel","Intussuscepção Intestinal","Neoplasias Pediátricas","Estenose Hipertrófica de Piloro","Gastrosquise e Onfalocele","Atresia Intestinal","Atresia de Esôfago e Fístulas Traqueoesofágicas","Malformações Anorretais","Doença Hirschsprung"]},
{n:"Cirurgia Pediátrica - Torácica",a:"Pediatria",t:["Cardiopatias Congênitas Acianóticas","Cardiopatias Congênitas Cianóticas","Malformações Broncopulmonares","Hérnia Diafragmática Congênita"]},
{n:"Cirurgia Pediátrica - Urológica",a:"Pediatria",t:["Criptorquidia","Hipospádia","Fimose e Parafimose","Malformações de Vias Urinárias"]},
{n:"Cirurgia Plástica",a:"Clínica Cirúrgica",t:["Enxertos e Retalhos","Úlceras Por Pressão"]},
{n:"Cirurgia Torácica",a:"Clínica Cirúrgica",t:["Pneumotórax","Traqueomalácia","Câncer de Pulmão","Derrame Pleural"]},
{n:"Colagenoses",a:"Clínica Médica",t:["Lúpus Eritematoso Sistêmico","Esclerose Sistêmica","Doença de Sjögren","Dermatomiosite e Polimiosite","Polimialgia Reumática","Sarcoidose","Fibromialgia","Doença Mista do Tecido Conjuntivo","Doença Relacionada ao IgG4"]},
{n:"Complicações Agudas do Diabetes Mellitus",a:"Clínica Médica",t:["Cetoacidose Diabética e Estado Hiperglicêmico Hiperosmolar","Hipoglicemia"]},
{n:"Complicações Cirúrgicas",a:"Clínica Cirúrgica",t:["Infecção de Sítio Cirúrgico e Antibioticoprofilaxia","Deiscência de Anastomose Duodenal","Seroma & Hematoma & Deiscência","Síndrome Compartimental Abdominal","Febre e Atelectasia no Pós-Operatório","Fístulas do Trato Gastrointestinal"]},
{n:"Complicações Crônicas do Diabetes Mellitus",a:"Clínica Médica",t:["Neuropatia Diabética","Retinopatia Diabética","Doença Renal Diabética","Pé Diabético"]},
{n:"Contracepção & Infertilidade",a:"Ginecologia e Obstetrícia",t:["Conceitos Gerais de Contracepção","Métodos Definitivos","Métodos Intrauterinos","Métodos de Barreira","Métodos Naturais","Métodos Hormonais","Infertilidade - Avaliação","Infertilidade - Tratamento"]},
{n:"Cuidados Pós-Natais",a:"Pediatria",t:["Classificação do Recém-Nascido","Reanimação Neonatal","Cuidados de Sala de Parto & Alojamento Conjunto","Hiperbilirrubinemia Indireta Neonatal","Colestase Neonatal","Hipoglicemia Neonatal","Hipocalcemia Neonatal","Alterações Cutâneas do RN","Sepse Neonatal"]},
{n:"Dermatologia",a:"Clínica Médica",t:["Psoríase","Dermatite de Fralda","Dermatite de Contato","Eritema Nodoso","Sarcomas","Pênfigo","Acne","Hidradenite Supurativa","Neurofibromatose"]},
{n:"Dermatoses Infecciosas",a:"Clínica Médica",t:["Larva Migrans","Pediculose","Tungíase","Escabiose","Dermatofitoses (Tínea)","Pitiríase Versicolor","Molusco Contagioso","Lesões por HPV","Síndrome de Gianotti-Crosti"]},
{n:"Desconforto Respiratório do RN",a:"Pediatria",t:["Síndrome da Aspiração de Mecônio","Hipertensão Pulmonar Persistente do RN","Taquipneia Transitória do RN","Síndrome do Desconforto Respiratório do RN","Asfixia Perinatal","Pneumonia Neonatal"]},
{n:"Diabetes Mellitus Tipo 1",a:"Clínica Médica",t:["Diabetes Mellitus Tipo 1","Diabetes Monogênico"]},
{n:"Diabetes Mellitus Tipo 2",a:"Clínica Médica",t:["DM 2 - Clínica e Diagnóstico","DM 2 - Tratamento sem Insulina","DM 2 - Insulina"]},
{n:"Diarreia & Constipação & Dor Abdominal",a:"Clínica Médica",t:["Diarreia Aguda - Fisiopatologia","Diarreia Aguda - Abordagem","Doença Inflamatória Intestinal","Constipação","Doença Celíaca","Síndrome do Intestino Irritável","Gastroparesia","SIBO","Pancreatite Crônica","Dispepsia"]},
{n:"Distúrbios da Hemostasia",a:"Clínica Médica",t:["Púrpura Trombocitopênica Trombótica (PTT)","Púrpura Trombocitopênica Imune (PTI)","Coagulação Intravascular Disseminada (CIVD)","Trombofilia","Síndrome do Anticorpo Antifosfolípide","Hemofilia","Anticoagulação e sua Reversão","Doença de von Willebrand","Síndrome Hemolítico-Urêmica"]},
{n:"Distúrbios do Ritmo",a:"Clínica Médica",t:["ACLS","BLS","PALS","Fibrilação Atrial","Bloqueio Atrioventricular","Flutter Atrial","Taquicardia por Reentrada Atrioventricular","Taquicardia por Reentrada Nodal","Taquicardia Ventricular Monomórfica"]},
{n:"Distúrbios Hidroeletrolíticos & Ácido-Base",a:"Clínica Médica",t:["Distúrbios do Potássio — Fisiopatologia","Hiponatremia","Hipernatremia","Distúrbios do Potássio — Abordagem","Distúrbios Ácido-Base"]},
{n:"Doenças do Metabolismo Ósseo",a:"Clínica Médica",t:["Distúrbios da Vitamina D","Distúrbios do Magnésio","Hiperparatireoidismo Primário","Osteoporose","Distúrbios do Cálcio"]},
{n:"Doenças Exantemáticas",a:"Pediatria",t:["Sarampo","Rubéola","Varicela","Parvovírus B19 & Eritema Infeccioso","Exantema Súbito","Mão-Pé-Boca & Herpangina","Escarlatina"]},
{n:"Doenças Valvares",a:"Clínica Médica",t:["Febre Reumática","Endocardite Infecciosa","Insuficiência Aórtica","Estenose Aórtica","Estenose Mitral","Insuficiência Mitral","Valvopatias Tricúspides e Pulmonares"]},
{n:"Doenças Vasculares",a:"Clínica Cirúrgica",t:["Trombose Venosa Profunda","Insuficiência Venosa Crônica","Oclusão Arterial Aguda","Doença Arterial Obstrutiva Periférica","Dissecção de Aorta e Outras Síndromes Aórticas","Aneurismas de Aorta Abdominal","Estenose de Carótidas"]},
{n:"Dor Torácica",a:"Clínica Médica",t:["Síndrome Coronariana Aguda – Fisiopatologia & Diagnóstico","Síndrome Coronariana Aguda – Terapia de Reperfusão","Síndrome Coronariana Aguda – Princípios do Tratamento","Síndrome Coronariana Crônica","Pericardite Aguda","Miocardite"]},
{n:"Epidemiologia",a:"Preventiva & Social",t:["Vigilância Epidemiológica","Saúde Coletiva","Transição Demográfica e Epidemiológica","Endemia & Epidemia & Pandemia"]},
{n:"Exposições Ambientais",a:"Clínica Médica",t:["Corpo Estranho na Pediatria","Mordedura de Animais","Acidentes Ofídicos","Acidentes com Aracnídeos","Acidente Escorpiônico","Síndrome Serotoninérgica","Síndrome Colinérgica & Intoxicação por Carbamatos/Organofosforados","Intoxicação por Benzodiazepínicos","Intoxicação por Paracetamol","Intoxicação por Opioides","Intoxicação por Lítio"]},
{n:"Farmacodermias",a:"Clínica Médica",t:["Síndrome de Stevens-Johnson e NET","Síndrome DRESS","Eritema Multiforme"]},
{n:"Fraturas",a:"Clínica Cirúrgica",t:["Profilaxia do Tétano","Conceitos Gerais de Fraturas","Fraturas Expostas","Fraturas de Quadril","Fraturas de Antebraço","Fraturas de Tornozelo","Fraturas de Tíbia","Fraturas de Úmero","Síndrome da Embolia Gordurosa","Síndrome Compartimental"]},
{n:"Geriatria",a:"Clínica Médica",t:["Manejo Paliativo de Sintomas","Cuidados Paliativos","Delirium","Idoso Frágil & Polifarmácia","Atendimento ao Idoso Vítima de Violência"]},
{n:"Glomerulopatias & Tubulopatias",a:"Clínica Médica",t:["Síndrome Nefrótica","Síndrome Nefrótica na Pediatria","Nefropatia por IgA","Nefropatia Membranosa","Glomerulonefrite Membranoproliferativa","Glomerulonefrite Rapidamente Progressiva (GNRP)","Glomeruloesclerose Segmentar e Focal (GESF)","Doença de Lesões Mínimas","Síndrome Nefrítica","Glomerulonefrite Pós-Estreptocóccica (GNPE)","Nefrite Intersiticial Aguda","Tubulopatias","Nefrite Lúpica","Nefroesclerose Hipertensiva","Urinálise"]},
{n:"Hebiatria",a:"Pediatria",t:["Puberdade Fisiológica","Atendimento a Adolescentes","Segurança da Criança","Alterações da Puberdade"]},
{n:"Hemorragia Digestiva & Doenças Anorificiais",a:"Clínica Cirúrgica",t:["Hemorragia Digestiva Alta","Hemorragia Digestiva Baixa","Doença Hemorroidária","Abscesso e Fístula Anorretal","Fissura Anal","Câncer Anal"]},
{n:"Hepatites",a:"Clínica Médica",t:["Hepatite C","Hepatite B","Hepatite A","Lesão Hepática Induzida por Drogas","Hepatite Autoimune","Hepatite Alcoólica"]},
{n:"Hérnias",a:"Clínica Cirúrgica",t:["Hérnias Inguinocrurais","Outras Hérnias","Hérnias da Infância"]},
{n:"Hipertensão Arterial Sistêmica & Dislipidemia",a:"Clínica Médica",t:["Hipertensão no Adulto","Hipertensão — Urgências e Emergências","Hipertensão Renovascular","Hiperaldosteronismo Primário","Feocromocitoma & Paraganglioma","Hipertensão Arterial Sistêmica na Criança","Dislipidemia"]},
{n:"Hipertensão & Diabetes & Outras Doenças na Gestação",a:"Ginecologia e Obstetrícia",t:["Síndrome HELLP","Pré-Eclâmpsia","Eclâmpsia","Hipertensão Gestacional","Diabetes Mellitus Gestacional","Gestação Múltipla","Doenças Clínicas na Gestação","Doenças da Tireoide na Gestação","Insuficiência Istmo-Cervical"]},
{n:"Hipófise & Tireoide & Adrenal",a:"Clínica Médica",t:["Insuficiência Adrenal","Incidentaloma Adrenal","Síndrome de Cushing","Hipopituitarismo","Distúrbios do GH","Hipertireoidismo","Hipotireoidismo Subclínico","Hipotireoidismo"]},
{n:"Hipoxemia",a:"Clínica Médica",t:["Síndrome do Desconforto Respiratório Agudo","Hipoxemia","Ventilação Mecânica","Tromboembolismo Pulmonar"]},
{n:"HIV e Infecções Oportunistas",a:"Clínica Médica",t:["HIV — Clínica & Diagnóstico","HIV — Manejo","HIV — PEP e PrEP","HIV-TB e Reconstituição Imune","AIDS e Profilaxias de Oportunistas","Pneumocistose","Criptococose","Infecção pelo CMV","Sarcoma de Kaposi","Histoplasmose","Candidíase","Toxoplasmose no Adulto"]},
{n:"Infecções Congênitas",a:"Pediatria",t:["Toxoplasmose Congênita","Infecção pelo Citomegalovírus Congênita","Infecção pelo Zika Vírus Congênita","Rubéola Congênita","Sífilis Congênita"]},
{n:"Infecções de Pele e Partes Moles",a:"Clínica Médica",t:["Celulite e Erisipela","Impetigo","Infecção Necrotizante de Tecidos Moles","Úlcera de Buruli","Doença Pilonidal","Gangrena Gasosa"]},
{n:"Infecções de Vias Aéreas Superiores",a:"Clínica Médica",t:["Faringite Aguda","Influenza & Gripe","Mononucleose & Epstein Barr","Resfriado Comum","Rinossinusite Aguda","Síndrome Gripal & SRAG","Otite Média Aguda em Crianças","Rinossinusite em Crianças","Crupe"]},
{n:"Infecções do SNC",a:"Clínica Médica",t:["Meningites","Encefalites Infecciosas","Encefalite Herpética","Poliomielite","Encefalites Autoimunes"]},
{n:"Infecções na Gestação",a:"Ginecologia e Obstetrícia",t:["HIV na Gestação","Sífilis na Gestação","Outras Infecções na Gestação","ITU na Gestação","Toxoplasmose na Gestação"]},
{n:"Infecções Respiratórias",a:"Clínica Médica",t:["Pneumonia Adquirida na Comunidade","Pneumonia: Aspectos Patológicos e Radiológicos","Pneumonia por Micoplasma e Clamídia","Difteria","Abscesso Pulmonar","COVID-19"]},
{n:"Infectologia Brasileira",a:"Clínica Médica",t:["Leishmaniose","Doença de Chagas","Malária","Leptospirose","Febre Maculosa","Hanseníase","Hantavirose"]},
{n:"Infectologia Pediátrica",a:"Pediatria",t:["Bronquiolite","Coqueluche","Pneumonia na Criança","ITU na Criança","Meningites em Crianças","Caxumba","Síndrome da Pele Escaldada Estafilocócica","Febre Sem Sinais Localizatórios & de Origem Indeterminada"]},
{n:"Insuficiência Cardíaca",a:"Clínica Médica",t:["Insuficiência Cardíaca – Ambulatorial","Insuficiência Cardíaca – Descompensação","Temas Avançados de Insuficiência Cardíaca","Síncope","Amiloidose","Cardiomiopatias"]},
{n:"Insuficiência Hepática",a:"Clínica Médica",t:["Peritonite Bacteriana Espontânea","Encefalopatia Hepática","Hipertensão Portal","Ascite","Síndrome Hepatorrenal","Cirrose","Insuficiência Hepática Aguda"]},
{n:"Insuficiência Renal",a:"Clínica Médica",t:["Injúria Renal Aguda","Diálise","Transplante Renal","Doença Renal Crônica"]},
{n:"Intercorrências no Parto",a:"Ginecologia e Obstetrícia",t:["Rotura Prematura de Membranas Ovulares","Restrição de Crescimento Intrauterino","Dopplervelocitometria e Perfil Biofísico Fetal","Trabalho de Parto Prematuro","Corioamnionite","Pós-Datismo","Óbito Fetal","Fórceps","Cardiotocografia"]},
{n:"Lesões Hepáticas",a:"Clínica Cirúrgica",t:["Abscesso Hepático","Tumores Hepáticos Benignos","Carcinoma Hepatocelular","Lesões Císticas do Fígado e Via Biliar"]},
{n:"Mama",a:"Ginecologia e Obstetrícia",t:["Câncer de Mama","Rastreio do Câncer de Mama","Lesões Benignas da Mama","Mastalgia","Secreção Papilar"]},
{n:"Medicina Baseada em Evidências",a:"Preventiva & Social",t:["Estudos Epidemiológicos","Conceitos em Pesquisa Clínica","Testes Diagnósticos","Medidas de Associação","Bioestatística"]},
{n:"Medicina Legal",a:"Preventiva & Social",t:["Saúde do Trabalhador","Código de Ética Médica","Morte Encefálica","Declaração de Óbito"]},
{n:"Menopausa",a:"Ginecologia e Obstetrícia",t:["Síndrome Genitourinária da Menopausa","Climatério e Menopausa","Incontinência Urinária","Prolapso de Órgãos Pélvicos"]},
{n:"Micologia",a:"Clínica Médica",t:["Paracoccidioidomicose","Aspergilose Invasiva","Esporotricose","Mucormicose"]},
{n:"Neoplasias Urológicas",a:"Clínica Cirúrgica",t:["Câncer de Próstata","Câncer de Bexiga","Câncer de Pênis","Câncer de Testículo","Tumores Renais"]},
{n:"Neurologia",a:"Clínica Médica",t:["Epilepsia e Crises Epilépticas e Estado de Mal","Convulsão Febril","Paralisia de Bell","Trombose Venosa Cerebral","Mielopatias","Distúrbios do Sono","Miastenia Gravis","Síndrome de Guillain-Barré","Esclerose Lateral Amiotrófica","Esclerose Múltipla"]},
{n:"Neurologia Pediátrica",a:"Pediatria",t:["BRUE","Transtorno do Espectro Autista (TEA)","Transtorno do Déficit de Atenção e Hiperatividade","Transtorno Opositor Desafiador","Paralisia Cerebral"]},
{n:"Obesidade",a:"Clínica Médica",t:["Cirurgia Bariátrica e Metabólica","Obesidade e Síndrome Metabólica","Apneia Obstrutiva do Sono"]},
{n:"Oftalmologia",a:"Clínica Médica",t:["Abrasão Corneana e Corpo Estranho","Conjuntivites","Glaucoma","Catarata","Trauma Ocular","Degeneração Macular","Distúrbios da Refração","Doenças da Pálpebra","Estrabismo"]},
{n:"Oncoginecologia",a:"Ginecologia e Obstetrícia",t:["Câncer de Colo Invasivo","Rastreio do Câncer de Colo","Câncer de Ovário","Hiperplasia e Câncer de Endométrio","Massas Anexiais Benignas","Dermatoses da Vulva","Neoplasias da Vulva"]},
{n:"Oncohematologia",a:"Clínica Médica",t:["Mieloma Múltiplo","Trombocitemia Essencial","Síndromes Mielodisplásicas","Mielofibrose Primária","Policitemia Vera","Outras Gamopatias Monoclonais","Leucemias Mieloides","Leucemias Linfoides","Linfomas","Neutropenia Febril","Síndrome de Lise Tumoral"]},
{n:"Ortopedia",a:"Clínica Cirúrgica",t:["Lombalgia","Radiculopatias","Osteomielite em Adultos","Cisto de Baker","Lesões Meniscais","Lesões do Ligamento Cruzado Anterior","Síndrome do Impacto","Entorses de Tornozelo","Lesões do Tendão de Aquiles","Síndrome do Túnel do Carpo","Epicondilite","Lesões de Manguito Rotador","Tumores Ósseos Malignos","Tumores Ósseos Benignos"]},
{n:"Ortopedia Pediátrica",a:"Pediatria",t:["Mielomeningocele","Sinovite Transitória","Doença de Osgood-Schlatter","Displasia do Desenvolvimento do Quadril","Epifisiólise Proximal do Fêmur","Escoliose","Torcicolo Congênito","Dor do Crescimento"]},
{n:"Otorrinolaringologia",a:"Clínica Médica",t:["Otite Externa","Otite Média","Epistaxe","Distúrbios da Audição"]},
{n:"Outras Hepatopatias",a:"Clínica Médica",t:["Doença de Wilson","Hemocromatose Hereditária","Transplante Hepático","Colangite Biliar Primária","Colangite Esclerosante Primária","Doença Hepática Esteatótica Associada à Disfunção Metabólica","Metabolismo da Bilirrubina e Icterícias não-obstrutivas"]},
{n:"Outras Infecções",a:"Clínica Médica",t:["Febre Tifoide","Varíola","Mpox","Tétano","Raiva Humana","Herpes-Zóster","Herpes Simplex"]},
{n:"Outras Pneumopatias",a:"Clínica Médica",t:["Tabagismo","Hipertensão Pulmonar","Avaliação das Doenças Pulmonares Intersticiais","Fibrose Pulmonar Idiopática","Bronquiectasia","Tosse Crônica"]},
{n:"Parasitoses",a:"Clínica Médica",t:["Giardíase","Toxocaríase","Estrongiloidíase","Esquistossomose","Ascaridíase","Amebíase","Cisticercose","Ancilostomíase","Tricuríase"]},
{n:"Parto",a:"Ginecologia e Obstetrícia",t:["Profilaxia de Estrepto B","Fases do Trabalho de Parto","Estática Fetal","Indução do Parto","Parto Pélvico","Partograma","Assistência ao Trabalho de Parto","Cesárea","Distócias"]},
{n:"Pré-Natal",a:"Ginecologia e Obstetrícia",t:["Diagnóstico & Datação da Gestação","Adaptações & Queixas da Gestação","Assistência Pré-Natal","Vacinas da Gestante","Direitos da Gestante","Fármacos na Gestação","Êmese e Hiperêmese Gravídica","Aloimunização Rh"]},
{n:"Prematuridade",a:"Pediatria",t:["Complicações da Prematuridade","Displasia Broncopulmonar","Enterocolite Necrosante","Doença Hemorrágica do RN"]},
{n:"Princípios de Cirurgia",a:"Clínica Cirúrgica",t:["Avaliação Pré-Operatória","Protocolo de Cirurgia Segura","Nutrição Perioperatória","REMIT","Cicatrização de Feridas","Fios & Suturas","Cirurgia Minimamente Invasiva","Acesso Venoso Central","Ostomias"]},
{n:"Psiquiatria",a:"Clínica Médica",t:["Transtornos de Ansiedade","Transtornos Depressivos","Transtornos de Personalidade","Esquizofrenia & Psicose","Transtorno Afetivo Bipolar","Transtornos Alimentares","Álcool","Antidepressivos e Ansiolíticos","Antipsicóticos e Antiepilépticos e Estabilizadores do Humor","Suicídio","Transtornos Somáticos","Síndrome de Burnout"]},
{n:"Puericultura",a:"Pediatria",t:["Aleitamento Materno","Introdução Alimentar","Vitaminas & Minerais na Puericultura","Avaliação do DNPM","Avaliação Pôndero-Estatural","Desnutrição","Saúde Bucal","Abuso Infantil","Enurese Noturna"]},
{n:"Puerpério",a:"Ginecologia e Obstetrícia",t:["Modificações Fisiológicas do Puerpério","Infecções Puerperais","Hemorragia Pós-Parto"]},
{n:"Reações Transfusionais",a:"Clínica Médica",t:["Reações Febris Não-Hemolíticas","Reações Hemolíticas","TRALI e TACO"]},
{n:"Reumatologia Pediátrica",a:"Pediatria",t:["Doença de Kawasaki","Síndrome Inflamatória Multissistêmica Pediátrica (SIM-P)","Síndrome PFAPA","Artrite Idiopática Juvenil","Lúpus Eritematoso Sistêmico Juvenil"]},
{n:"Sangramento Uterino Anormal",a:"Ginecologia e Obstetrícia",t:["Avaliação de SUA","Adenomiose","Dismenorreia","Leiomioma","Pólipo Uterino","Endometriose"]},
{n:"Sangramentos na Gestação",a:"Ginecologia e Obstetrícia",t:["Doença Trofoblástica Gestacional","Abortamento","Gestação Ectópica","Violência Sexual e Aborto Induzido","Placenta Prévia","Descolamento Prematuro de Placenta","Rotura Uterina","Vasa Prévia"]},
{n:"Sepse & Infecções Relacionadas à Assistência à Saúde",a:"Clínica Médica",t:["Segurança do Profissional da Saúde","Infecção por C. difficile","Pneumonia Associada ao Ventilador","Infecção de Corrente Sanguínea associada à Cateter","Sepse e Choque Séptico","Infecção do Trato Urinário"]},
{n:"Síndromes Demenciais",a:"Clínica Médica",t:["Avaliação do Paciente com Demência","Demência Vascular","Doença de Alzheimer","Demência Frontotemporal","Demência por Corpúsculos de Lewy","Demências Infecciosas","Hidrocefalia de Pressão Normal"]},
{n:"SUS & Políticas Públicas",a:"Preventiva & Social",t:["Marcos Históricos do SUS","Organização Jurídica do SUS","Organização Financeira do SUS","Princípios do SUS","Política Nacional de Humanização","Políticas e Protocolos","Políticas de Saúde Mental"]},
{n:"Transtornos do Movimento",a:"Clínica Médica",t:["Doença de Parkinson","Distonia & Discinesia Tardia","Tremor Essencial","Doença de Huntington","Atrofia de Múltiplos Sistemas","Paralisia Supranuclear Progressiva"]},
{n:"Trauma - Abdominal & Pélvico",a:"Clínica Cirúrgica",t:["Trauma Abdominal e Diafragmático","Trauma Gastrointestinal","Trauma Esplênico","Trauma Hepático","Cirurgia de Controle de Danos","Trauma Pélvico"]},
{n:"Trauma - Avaliação inicial",a:"Clínica Cirúrgica",t:["Epidemiologia e Triagem no Trauma","Avaliação Inicial no Trauma","Imobilização Cervical e Via Aérea no Trauma","Via Aérea Básica e Avançada","Choque Hemorrágico","Tromboelastografia"]},
{n:"Trauma - Queimadura & Populações Especiais",a:"Clínica Cirúrgica",t:["Queimaduras","Choque Elétrico","Afogamento","Trauma na Criança","Trauma na Gestante","Trauma no Idoso"]},
{n:"Trauma - Retroperitoneal",a:"Clínica Cirúrgica",t:["Trauma Retroperitoneal","Trauma do Duodeno e do Pâncreas","Trauma Renal","Trauma de Uretra & Bexiga & Ureter"]},
{n:"Trauma - TCE",a:"Clínica Cirúrgica",t:["Noções Gerais de TCE e Concussão","Fratura de Crânio e Hematomas Intracranianos","TCE Grave e Herniação Cerebral","Escala de Coma de Glasgow"]},
{n:"Trauma Torácico & Outros",a:"Clínica Cirúrgica",t:["Trauma Torácico","Trauma de Face","Trauma Cervical","Trauma Vertebral e Raquimedular","Trauma de Extremidades"]},
{n:"Triagem Neonatal & Síndromes e Doenças Genéticas",a:"Pediatria",t:["Testes de Triagem Neonatal","Fibrose Cística","Hiperplasia Adrenal Congênita","Hipotireoidismo Congênito","Erros Inatos do Metabolismo","Síndrome de Down","Síndrome Alcoólica Fetal","Discinesia Ciliar Primária"]},
{n:"Tuberculose",a:"Clínica Médica",t:["Tuberculose - Patogênese e Epidemiologia","Tuberculose - Clínica e Diagnóstico","Tuberculose - Tratamento","Tuberculose Latente","Tuberculose Miliar e Extrapulmonar","Tuberculose na Criança"]},
{n:"Úlceras Genitais",a:"Clínica Médica",t:["Herpes Genital","Linfogranuloma Venéreo","Cancroide","Donovanose","Abordagem das Úlceras Genitais","Sífilis"]},
{n:"Urologia",a:"Clínica Cirúrgica",t:["Nefrolitíase","Hiperplasia Prostática Benigna","Priapismo","Doença de Peyronie","Afecções Testiculares"]},
{n:"Vacinação",a:"Preventiva & Social",t:["Noções Sobre Vacinação","Calendário Vacinal - Criança & Adulto & Idoso","Vacinas das Arboviroses","BCG","Pentavalente e DTP","Vacinas da Poliomielite","Vacina do Rotavírus","Vacinas das Hepatites","Vacinas do Pneumococo & Meningococo","Vacinas do HPV","Influenza & COVID-19 & VSR","Tríplice Viral & Varicela & Herpes-Zóster"]},
{n:"Vasculites",a:"Clínica Médica",t:["Arterite de Takayasu","Arterite de Células Gigantes","Poliarterite Nodosa","Vasculite por IgA","Granulomatose com Poliangeíte & Poliangeíte Microscópica","Tromboangeíte Obliterante","Doença de Behçet"]},
{n:"Vertigem",a:"Clínica Médica",t:["Doença de Menière","Avaliação da Vertigem","Neurite Vestibular","Vertigem Posicional Paroxística Benigna"]},
{n:"Vias Biliares",a:"Clínica Cirúrgica",t:["Colecistite","Colelitíase e Colecistolitíase","Coledocolitíase","Colecistectomia e Lesões da Via Biliar","Colangite Aguda","Íleo Biliar","Síndrome de Mirizzi","Câncer da Vesícula Biliar","Colangiocarcinoma"]},
{n:"Vulvovaginites",a:"Ginecologia e Obstetrícia",t:["Vaginose Bacteriana","Tricomoníase","Vaginite Inflamatória Descamativa","Cisto & Abscesso da Glândula de Bartholin","Candidíase Vaginal","Vulvovaginites em Crianças","Doença Inflamatória Pélvica","Cervicite & Uretrite & Epididimite & Proctite"]},
];

// ── helpers ──
const prank = n => { const i=PO.indexOf(n); return i===-1?PO.length:i; };
const plabel = n => { const r=prank(n),t=PO.length; return r<t*.25?"Alta":r<t*.6?"Média":"Baixa"; };
const ld = (k,d) => { try{const v=localStorage.getItem(k);return v?JSON.parse(v):d;}catch{return d;} };
const sd = (k,v) => { try{localStorage.setItem(k,JSON.stringify(v));}catch{}  };
const tod = () => new Date().toISOString().split("T")[0];
const fmtD = d => { if(!d)return"—"; const[y,m,dy]=d.split("-"); return `${dy}/${m}/${y}`; };
const isOD = d => d&&d<tod();
const isTod = d => d===tod();

const sortedMods = [...MR].sort((a,b)=>{
  const ia=PO.indexOf(a.n),ib=PO.indexOf(b.n);
  if(ia===-1&&ib===-1)return 0; if(ia===-1)return 1; if(ib===-1)return -1; return ia-ib;
});

function initMods(){
  return sortedMods.map(m=>({
    name:m.n, area:m.a, temas:m.t,
    status:"nao_estudado", firstContact:null,
    revisoes:[], revisaoGeral:[],
    prevalencia:plabel(m.n), prevRank:prank(m.n)
  }));
}

function calcNext(acc,nRev,nome,lastDate){
  const rank=prank(nome),total=PO.length,pf=1-(rank/total)*0.5;
  let base=acc>=80?14:acc>=60?7:acc>=40?4:2;
  base=base*(1+nRev*.1)/pf;
  base=Math.round(Math.max(1,Math.min(base,60)));
  const d=new Date(lastDate); d.setDate(d.getDate()+base);
  return d.toISOString().split("T")[0];
}

function calcGenRevs(nome,first,prova){
  const rank=prank(nome),total=PO.length;
  const d1=new Date(first),dp=new Date(prova||PROVADATE);
  const daysLeft=Math.max(0,Math.floor((dp-d1)/86400000));
  let n=rank<total*.25?3:rank<total*.6?2:1;
  if(daysLeft<60)n=Math.min(n,1);
  return Array.from({length:n},(_,i)=>{
    const frac=(i+1)/(n+1);
    return new Date(d1.getTime()+frac*(dp-d1)).toISOString().split("T")[0];
  });
}

// ═══════════════════════════════════════════════
//  APP ROOT
// ═══════════════════════════════════════════════
export default function App(){
  const [mods,setMods]=useState(()=>ld("med_mods3",null)||initMods());
  const [page,setPage]=useState("home");
  const [selMod,setSelMod]=useState(null);
  const [filter,setFilter]=useState({area:"",status:"",prev:"",q:""});
  const [provas,setProvas]=useState(()=>ld("med_provas3",[]));
  const [caderno,setCaderno]=useState(()=>ld("med_caderno3",{}));
  const [cadArea,setCadArea]=useState("Clínica Médica");
  const [toast,setToast]=useState(null);

  useEffect(()=>sd("med_mods3",mods),[mods]);
  useEffect(()=>sd("med_provas3",provas),[provas]);
  useEffect(()=>sd("med_caderno3",caderno),[caderno]);

  const notify=(msg,type="ok")=>{setToast({msg,type});setTimeout(()=>setToast(null),2800);};

  // stats
  const totalQ=mods.reduce((s,m)=>s+m.revisoes.reduce((a,r)=>a+r.questoes,0),0);
  const totalRev=mods.reduce((s,m)=>s+m.revisoes.length,0);
  const concl=mods.filter(m=>m.status==="concluido").length;
  const em=mods.filter(m=>m.status==="em_andamento").length;
  const allAcc=mods.flatMap(m=>m.revisoes.map(r=>r.acertos));
  const gAcc=allAcc.length?Math.round(allAcc.reduce((a,b)=>a+b,0)/allAcc.length):0;
  const overdueR=mods.filter(m=>{const l=m.revisoes[m.revisoes.length-1];return l&&isOD(l.proxima);});
  const todayR=mods.filter(m=>{const l=m.revisoes[m.revisoes.length-1];return l&&isTod(l.proxima);});
  const overdueG=mods.filter(m=>m.revisaoGeral.some(r=>r.status!=="feita"&&isOD(r.data)));
  const todayG=mods.filter(m=>m.revisaoGeral.some(r=>r.status!=="feita"&&isTod(r.data)));
  const qtHoje=mods.reduce((s,m)=>s+m.revisoes.filter(r=>r.data===tod()).reduce((a,r)=>a+r.questoes,0),0);
  const provaQ=provas.reduce((s,p)=>s+(p.total||0),0);
  const provaAc=provas.reduce((s,p)=>s+(p.acertos||0),0);
  const provaAcc=provaQ?Math.round((provaAc/provaQ)*100):0;

  function updMod(idx,upd){setMods(ms=>{const n=[...ms];n[idx]={...n[idx],...upd};return n;});}

  function addRev(modIdx,{data,questoes,acertos}){
    const m=mods[modIdx];
    const prev=m.revisoes;
    const avgAcc=prev.length?Math.round((prev.reduce((s,r)=>s+r.acertos,0)+acertos)/(prev.length+1)):acertos;
    const proxima=calcNext(avgAcc,prev.length+1,m.name,data);
    const novas=[...prev,{data,questoes,acertos,proxima,id:Date.now()}];
    const fc=m.firstContact||data;
    let rg=m.revisaoGeral;
    if(!m.firstContact){const ds=calcGenRevs(m.name,data,PROVADATE);rg=ds.map((d,i)=>({id:i,data:d,status:"pendente"}));}
    updMod(modIdx,{revisoes:novas,status:m.status==="nao_estudado"?"em_andamento":m.status,firstContact:fc,revisaoGeral:rg});
    notify("Revisão registrada ✓");
  }

  function delRev(modIdx,revId){
    const m=mods[modIdx];
    const novas=m.revisoes.filter(r=>r.id!==revId);
    updMod(modIdx,{revisoes:novas,status:novas.length===0?"nao_estudado":m.status,firstContact:novas.length?m.firstContact:null,revisaoGeral:novas.length?m.revisaoGeral:[]});
    notify("Revisão removida","info");
  }

  function editRev(modIdx,revId,upd){
    const m=mods[modIdx];
    const novas=m.revisoes.map(r=>r.id===revId?{...r,...upd}:r);
    updMod(modIdx,{revisoes:novas});
    notify("Revisão atualizada ✓");
  }

  function markGen(modIdx,rgIdx,status){
    const m=mods[modIdx];
    const rg=[...m.revisaoGeral];
    rg[rgIdx]={...rg[rgIdx],status};
    const done=rg.every(r=>r.status==="feita");
    updMod(modIdx,{revisaoGeral:rg,status:done&&m.status==="em_andamento"?"concluido":m.status});
  }

  function saveProva(p,editIdx){
    if(editIdx!==null){setProvas(ps=>{const n=[...ps];n[editIdx]={...n[editIdx],...p};return n;});notify("Prova atualizada ✓");}
    else{setProvas(ps=>[...ps,{...p,id:Date.now()}]);notify("Prova adicionada ✓");}
  }
  function delProva(idx){setProvas(ps=>ps.filter((_,i)=>i!==idx));notify("Prova removida","info");}

  const filtMods=mods.filter(m=>{
    if(filter.area&&m.area!==filter.area)return false;
    if(filter.status&&m.status!==filter.status)return false;
    if(filter.prev&&m.prevalencia!==filter.prev)return false;
    if(filter.q&&!m.name.toLowerCase().includes(filter.q.toLowerCase()))return false;
    return true;
  });

  const nav=[
    {id:"home",icon:"🏠",label:"Início"},
    {id:"modules",icon:"📚",label:"Módulos"},
    {id:"dashboard",icon:"📊",label:"Desempenho"},
    {id:"provas",icon:"📝",label:"Provas"},
    {id:"caderno",icon:"✏️",label:"Caderno de Erros"},
  ];

  return(
    <div style={{minHeight:"100vh",background:"#f1f5f9",display:"flex",fontFamily:"'Georgia',serif"}}>
      {toast&&<div style={{position:"fixed",top:16,right:16,zIndex:9999,background:toast.type==="info"?"#334155":"#059669",color:"#fff",padding:"11px 18px",borderRadius:10,boxShadow:"0 4px 16px rgba(0,0,0,0.2)",fontSize:13,fontFamily:"sans-serif"}}>{toast.msg}</div>}

      {/* sidebar */}
      <aside style={{position:"fixed",left:0,top:0,bottom:0,width:210,background:"#0f172a",display:"flex",flexDirection:"column",zIndex:100}}>
        <div style={{padding:"22px 16px 14px",borderBottom:"1px solid #1e293b"}}>
          <div style={{fontSize:9,letterSpacing:3,color:"#475569",fontFamily:"sans-serif",marginBottom:3}}>RESIDÊNCIA MÉDICA</div>
          <div style={{fontSize:19,fontWeight:700,color:"#f1f5f9"}}>MedStudy</div>
          <div style={{fontSize:10,color:"#475569",fontFamily:"sans-serif",marginTop:3}}>Prova: 15/09/2025</div>
        </div>
        <nav style={{flex:1,paddingTop:8}}>
          {nav.map(item=>(
            <button key={item.id} onClick={()=>{setPage(item.id);setSelMod(null);}}
              style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"10px 16px",background:page===item.id?"#1e3a5f":"transparent",border:"none",color:page===item.id?"#60a5fa":"#94a3b8",cursor:"pointer",fontSize:13,fontFamily:"sans-serif",borderLeft:page===item.id?"3px solid #3b82f6":"3px solid transparent"}}>
              <span>{item.icon}</span>{item.label}
            </button>
          ))}
        </nav>
        <div style={{padding:"12px 16px",borderTop:"1px solid #1e293b",fontFamily:"sans-serif"}}>
          <div style={{fontSize:9,color:"#475569",marginBottom:5,letterSpacing:1}}>META: 15.000 QUESTÕES</div>
          <div style={{background:"#1e293b",borderRadius:3,height:4,marginBottom:4}}>
            <div style={{width:`${Math.min(100,(totalQ/15000)*100)}%`,height:"100%",background:"linear-gradient(90deg,#3b82f6,#8b5cf6)",borderRadius:3}}/>
          </div>
          <div style={{fontSize:9,color:"#475569"}}>{totalQ.toLocaleString("pt-BR")} / 15.000</div>
        </div>
      </aside>

      <main style={{marginLeft:210,flex:1}}>
        {page==="home"&&<Home {...{mods,overdueR,todayR,overdueG,todayG,qtHoje,totalQ,totalRev,concl,em,gAcc,provaAcc,provas,setPage,setSelMod,markGen}}/>}
        {page==="modules"&&<Modules {...{filtMods,mods,filter,setFilter,setPage,setSelMod}}/>}
        {page==="module_detail"&&selMod!==null&&<ModDetail mod={mods[selMod]} idx={selMod} {...{addRev,delRev,editRev,markGen,notify}} back={()=>setPage("modules")}/>}
        {page==="dashboard"&&<Dashboard {...{mods,totalQ,totalRev,concl,gAcc,provas,provaAcc}}/>}
        {page==="provas"&&<Provas {...{provas,saveProva,delProva}}/>}
        {page==="caderno"&&<Caderno area={cadArea} setArea={setCadArea} caderno={caderno} setCaderno={setCaderno}/>}
      </main>
    </div>
  );
}

// ═══════════════════════════════════════════════
//  HOME
// ═══════════════════════════════════════════════
function Home({mods,overdueR,todayR,overdueG,todayG,qtHoje,totalQ,totalRev,concl,em,gAcc,provaAcc,provas,setPage,setSelMod,markGen}){
  const dl=Math.max(0,Math.floor((new Date(PROVADATE)-new Date())/86400000));
  const now=new Date();
  const dias=["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
  const dt=`${dias[now.getDay()]}, ${String(now.getDate()).padStart(2,"0")}/${String(now.getMonth()+1).padStart(2,"0")}/${now.getFullYear()}`;
  const sugs=[
    ...overdueR.slice(0,2).map(m=>({t:"over",m})),
    ...todayR.slice(0,2).map(m=>({t:"hoje",m})),
    
  ].slice(0,7);

  const Stat=({v,l,c})=>(
    <div style={{background:"#fff",borderRadius:11,padding:"13px 15px",boxShadow:"0 1px 6px rgba(0,0,0,0.05)",borderTop:`3px solid ${c}`}}>
      <div style={{fontSize:24,fontWeight:700,color:c,fontFamily:"sans-serif"}}>{v}</div>
      <div style={{fontSize:10,color:"#64748b",marginTop:2,fontFamily:"sans-serif"}}>{l}</div>
    </div>
  );

  return(
    <div style={{padding:"26px 30px",maxWidth:1060,margin:"0 auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:22}}>
        <div>
          <div style={{fontSize:11,color:"#94a3b8",fontFamily:"sans-serif",marginBottom:2}}>{dt}</div>
          <h1 style={{fontSize:24,fontWeight:700,margin:0,color:"#0f172a"}}>Bom estudo! 👩‍⚕️</h1>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontSize:40,fontWeight:700,color:"#1d4ed8",fontFamily:"sans-serif",lineHeight:1}}>{dl}</div>
          <div style={{fontSize:10,color:"#94a3b8",fontFamily:"sans-serif"}}>dias para a prova</div>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:11,marginBottom:22}}>
        <Stat v={`${qtHoje}/${DAILY_GOAL}`} l="Questões hoje" c="#3b82f6"/>
        <Stat v={totalQ.toLocaleString("pt-BR")} l="Total questões" c="#0ea5e9"/>
        <Stat v={`${gAcc}%`} l="Acertos globais" c="#10b981"/>
        <Stat v={concl} l="Módulos concluídos" c="#8b5cf6"/>
        <Stat v={overdueR.length+overdueG.length} l="Atrasadas" c="#ef4444"/>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:16}}>
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          <div style={{background:"#fff",borderRadius:13,padding:18,boxShadow:"0 1px 6px rgba(0,0,0,0.05)"}}>
            <h2 style={{margin:"0 0 13px",fontSize:14,fontFamily:"sans-serif",fontWeight:700}}>📅 Plano do dia</h2>
            {sugs.length===0&&<div style={{color:"#94a3b8",fontSize:12,fontFamily:"sans-serif"}}>Tudo em dia! 🎉</div>}
            {sugs.map((s,i)=>{
              const mIdx=mods.findIndex(mx=>mx.name===s.m.name);
              const bg={over:"#fef2f2",hoje:"#eff6ff"}[s.t]||"#f8fafc";
              const bc={over:"#fecaca",hoje:"#bfdbfe"}[s.t]||"#e2e8f0";
              const ic={over:"🔴",hoje:"🔵"}[s.t]||"⚪";
              const lb={over:"Revisão atrasada",hoje:"Revisar hoje"}[s.t]||"";
              return(
                <div key={i} onClick={()=>{setSelMod(mIdx);setPage("module_detail");}}
                  style={{display:"flex",alignItems:"center",gap:9,padding:"9px 11px",marginBottom:6,borderRadius:8,cursor:"pointer",background:bg,border:`1px solid ${bc}`}}>
                  <span>{ic}</span>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:600,fontSize:12,fontFamily:"sans-serif",color:"#1e293b"}}>{s.m.name}</div>
                    <div style={{fontSize:10,color:"#64748b",fontFamily:"sans-serif"}}>{lb} · {s.m.area}</div>
                  </div>
                  <span style={{fontSize:9,padding:"1px 6px",borderRadius:20,fontFamily:"sans-serif",fontWeight:700,background:s.m.prevalencia==="Alta"?"#fee2e2":s.m.prevalencia==="Média"?"#fef9c3":"#f1f5f9",color:s.m.prevalencia==="Alta"?"#dc2626":s.m.prevalencia==="Média"?"#ca8a04":"#94a3b8"}}>{s.m.prevalencia}</span>
                </div>
              );
            })}
          </div>

          {(todayG.length>0||overdueG.length>0)&&(
            <div style={{background:"#fff",borderRadius:13,padding:18,boxShadow:"0 1px 6px rgba(0,0,0,0.05)"}}>
              <h2 style={{margin:"0 0 12px",fontSize:14,fontFamily:"sans-serif",fontWeight:700}}>📋 Revisões Gerais Pendentes</h2>
              {[...overdueG,...todayG].slice(0,6).flatMap((m,i)=>{
                const mIdx=mods.findIndex(mx=>mx.name===m.name);
                return m.revisaoGeral.filter(r=>r.status!=="feita"&&r.data<=tod()).map((rg,ri)=>(
                  <div key={`${i}-${ri}`} style={{display:"flex",alignItems:"center",gap:9,marginBottom:7,fontFamily:"sans-serif"}}>
                    <span style={{fontSize:14}}>{isOD(rg.data)?"⚠️":"📌"}</span>
                    <div style={{flex:1}}>
                      <div style={{fontSize:12,fontWeight:600}}>{m.name}</div>
                      <div style={{fontSize:10,color:"#64748b"}}>Revisão Geral · {fmtD(rg.data)}</div>
                    </div>
                    <button onClick={()=>markGen(mIdx,m.revisaoGeral.indexOf(rg),"feita")}
                      style={{fontSize:10,padding:"3px 9px",borderRadius:5,border:"none",background:"#10b981",color:"#fff",cursor:"pointer",fontFamily:"sans-serif"}}>✓ Feita</button>
                  </div>
                ));
              })}
            </div>
          )}
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div style={{background:"#0f172a",borderRadius:13,padding:18,color:"#f1f5f9"}}>
            <div style={{fontSize:9,fontFamily:"sans-serif",color:"#475569",letterSpacing:2,marginBottom:4}}>PROVAS NA ÍNTEGRA</div>
            <div style={{fontSize:36,fontWeight:700,fontFamily:"sans-serif",color:"#60a5fa"}}>{provaAcc}%</div>
            <div style={{fontSize:10,color:"#475569",fontFamily:"sans-serif",marginBottom:10}}>média de acertos</div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:11,fontFamily:"sans-serif",color:"#64748b"}}>
              <span>Simulados: {provas.filter(p=>p.tipo==="simulado").length}</span>
              <span>Reais: {provas.filter(p=>p.tipo==="prova_real").length}</span>
            </div>
            <button onClick={()=>setPage("provas")} style={{marginTop:10,width:"100%",padding:"7px",borderRadius:7,border:"1px solid #1e3a5f",background:"transparent",color:"#60a5fa",cursor:"pointer",fontSize:11,fontFamily:"sans-serif"}}>Ver provas →</button>
          </div>

          <div style={{background:"#fff",borderRadius:13,padding:18,boxShadow:"0 1px 6px rgba(0,0,0,0.05)"}}>
            <div style={{fontSize:11,fontFamily:"sans-serif",color:"#64748b",marginBottom:6}}>Meta: 15.000 questões</div>
            <div style={{background:"#f1f5f9",borderRadius:4,height:7,marginBottom:5}}>
              <div style={{width:`${Math.min(100,(totalQ/15000)*100)}%`,height:"100%",background:"linear-gradient(90deg,#3b82f6,#8b5cf6)",borderRadius:4}}/>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"#94a3b8",fontFamily:"sans-serif"}}>
              <span>{totalQ.toLocaleString("pt-BR")}</span><span>15.000</span>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginTop:10}}>
              {[["Revisões",totalRev,"#3b82f6"],["Em andamento",em,"#8b5cf6"]].map(([l,v,c])=>(
                <div key={l} style={{background:"#f8fafc",borderRadius:7,padding:"7px 9px"}}>
                  <div style={{fontSize:16,fontWeight:700,fontFamily:"sans-serif",color:c}}>{v}</div>
                  <div style={{fontSize:9,color:"#94a3b8",fontFamily:"sans-serif"}}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          <button onClick={()=>setPage("caderno")} style={{padding:"15px",borderRadius:13,border:"2px dashed #e2e8f0",background:"#fff",cursor:"pointer",fontFamily:"sans-serif",fontSize:13,color:"#475569",display:"flex",alignItems:"center",justifyContent:"center",gap:9,boxShadow:"0 1px 4px rgba(0,0,0,0.04)",fontWeight:600}}>
            ✏️ Caderno de Erros
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
//  MODULES
// ═══════════════════════════════════════════════
function Modules({filtMods,mods,filter,setFilter,setPage,setSelMod}){
  return(
    <div style={{padding:"26px 30px"}}>
      <h1 style={{fontSize:20,fontWeight:700,margin:"0 0 18px",color:"#0f172a"}}>📚 Módulos</h1>
      <div style={{background:"#fff",borderRadius:11,padding:12,marginBottom:18,boxShadow:"0 1px 4px rgba(0,0,0,0.04)",display:"flex",gap:9,flexWrap:"wrap",alignItems:"center"}}>
        <input placeholder="🔍 Buscar..." value={filter.q} onChange={e=>setFilter(f=>({...f,q:e.target.value}))}
          style={{padding:"6px 10px",borderRadius:6,border:"1px solid #e2e8f0",fontSize:12,fontFamily:"sans-serif",minWidth:170}}/>
        <select value={filter.area} onChange={e=>setFilter(f=>({...f,area:e.target.value}))} style={{padding:"6px 9px",borderRadius:6,border:"1px solid #e2e8f0",fontSize:12,fontFamily:"sans-serif"}}>
          <option value="">Todas as áreas</option>
          {AREAS.map(a=><option key={a} value={a}>{a}</option>)}
        </select>
        <select value={filter.status} onChange={e=>setFilter(f=>({...f,status:e.target.value}))} style={{padding:"6px 9px",borderRadius:6,border:"1px solid #e2e8f0",fontSize:12,fontFamily:"sans-serif"}}>
          <option value="">Todos os status</option>
          <option value="nao_estudado">Não estudado</option>
          <option value="em_andamento">Em andamento</option>
          <option value="concluido">Concluído</option>
        </select>
        <select value={filter.prev} onChange={e=>setFilter(f=>({...f,prev:e.target.value}))} style={{padding:"6px 9px",borderRadius:6,border:"1px solid #e2e8f0",fontSize:12,fontFamily:"sans-serif"}}>
          <option value="">Toda prevalência</option>
          <option value="Alta">Alta</option>
          <option value="Média">Média</option>
          <option value="Baixa">Baixa</option>
        </select>
        <span style={{fontSize:10,color:"#94a3b8",fontFamily:"sans-serif",marginLeft:"auto"}}>{filtMods.length} módulos</span>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))",gap:10}}>
        {filtMods.map(m=>{
          const mIdx=mods.findIndex(mx=>mx.name===m.name);
          const lr=m.revisoes[m.revisoes.length-1];
          const avg=m.revisoes.length?Math.round(m.revisoes.reduce((s,r)=>s+r.acertos,0)/m.revisoes.length):null;
          const over=lr&&isOD(lr.proxima);
          return(
            <div key={m.name} onClick={()=>{setSelMod(mIdx);setPage("module_detail");}}
              style={{background:"#fff",borderRadius:10,padding:"13px 15px",boxShadow:"0 1px 5px rgba(0,0,0,0.05)",cursor:"pointer",border:`1px solid ${over?"#fecaca":"#f1f5f9"}`,opacity:m.status==="nao_estudado"?0.76:1,borderLeft:`4px solid ${AC[m.area]||"#94a3b8"}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:5}}>
                <div style={{fontWeight:600,fontSize:12,color:"#1e293b",lineHeight:1.3,flex:1,fontFamily:"sans-serif"}}>{m.name}</div>
                <span style={{fontSize:8,padding:"2px 6px",borderRadius:20,marginLeft:6,flexShrink:0,fontFamily:"sans-serif",fontWeight:700,background:m.prevalencia==="Alta"?"#fee2e2":m.prevalencia==="Média"?"#fef9c3":"#f1f5f9",color:m.prevalencia==="Alta"?"#dc2626":m.prevalencia==="Média"?"#ca8a04":"#94a3b8"}}>{m.prevalencia}</span>
              </div>
              <div style={{fontSize:10,color:AC[m.area]||"#64748b",fontFamily:"sans-serif",marginBottom:6}}>{m.area}</div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                <span style={{fontSize:9,padding:"2px 6px",borderRadius:20,fontFamily:"sans-serif",fontWeight:600,background:`${SC[m.status]}20`,color:SC[m.status]}}>{SL[m.status]}</span>
                {m.revisoes.length>0&&<span style={{fontSize:9,color:"#94a3b8",fontFamily:"sans-serif"}}>{m.revisoes.length} rev.</span>}
                {avg!==null&&<span style={{fontSize:9,color:"#10b981",fontFamily:"sans-serif",fontWeight:600}}>{avg}%</span>}
                {over&&<span style={{fontSize:9,color:"#ef4444",fontFamily:"sans-serif"}}>⚠ Atrasado</span>}
                {lr&&!over&&<span style={{fontSize:9,color:"#3b82f6",fontFamily:"sans-serif"}}>Próx: {fmtD(lr.proxima)}</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
//  MODULE DETAIL
// ═══════════════════════════════════════════════
function ModDetail({mod:m,idx,addRev,delRev,editRev,markGen,notify,back}){
  const [showForm,setShowForm]=useState(false);
  const [editId,setEditId]=useState(null);
  const [form,setForm]=useState({data:tod(),questoes:"",acertos:""});
  const [conf,setConf]=useState(null);
  const avg=m.revisoes.length?Math.round(m.revisoes.reduce((s,r)=>s+r.acertos,0)/m.revisoes.length):null;
  const totQ=m.revisoes.reduce((s,r)=>s+r.questoes,0);

  function submit(){
    const q=parseInt(form.questoes),a=parseInt(form.acertos);
    if(!q||!form.data||isNaN(a)||a<0||a>100){notify("Preencha todos os campos corretamente","info");return;}
    if(editId!==null){editRev(idx,editId,{data:form.data,questoes:q,acertos:a});setEditId(null);}
    else{addRev(idx,{data:form.data,questoes:q,acertos:a});}
    setForm({data:tod(),questoes:"",acertos:""});setShowForm(false);
  }

  function startEdit(r){setForm({data:r.data,questoes:String(r.questoes),acertos:String(r.acertos)});setEditId(r.id);setShowForm(true);}

  const inp={padding:"6px 8px",borderRadius:6,border:"1px solid #e2e8f0",fontSize:12,fontFamily:"sans-serif",width:"100%",boxSizing:"border-box"};

  return(
    <div style={{padding:"26px 30px",maxWidth:860,margin:"0 auto"}}>
      <button onClick={back} style={{background:"none",border:"none",color:"#3b82f6",cursor:"pointer",fontSize:12,fontFamily:"sans-serif",marginBottom:14,padding:0}}>← Voltar</button>

      <div style={{background:"#fff",borderRadius:13,padding:20,marginBottom:18,boxShadow:"0 1px 6px rgba(0,0,0,0.05)",borderLeft:`5px solid ${AC[m.area]||"#3b82f6"}`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:10}}>
          <div>
            <h1 style={{fontSize:20,fontWeight:700,margin:"0 0 4px",color:"#0f172a"}}>{m.name}</h1>
            <div style={{fontSize:11,color:AC[m.area],fontFamily:"sans-serif"}}>{m.area}</div>
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            <span style={{fontSize:10,padding:"2px 8px",borderRadius:20,background:`${PC[m.prevalencia]||"#94a3b8"}20`,color:PC[m.prevalencia]||"#94a3b8",fontFamily:"sans-serif",fontWeight:700}}>Prevalência {m.prevalencia}</span>
            <span style={{fontSize:10,padding:"2px 8px",borderRadius:20,background:`${SC[m.status]}20`,color:SC[m.status],fontFamily:"sans-serif",fontWeight:700}}>{SL[m.status]}</span>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginTop:16}}>
          {[["Questões",totQ,"#3b82f6"],["Média",avg!==null?`${avg}%`:"—","#10b981"],["Revisões",m.revisoes.length,"#8b5cf6"],["1º Contato",fmtD(m.firstContact),"#f59e0b"]].map(([l,v,c])=>(
            <div key={l} style={{background:"#f8fafc",borderRadius:7,padding:"9px 11px",borderTop:`2px solid ${c}`}}>
              <div style={{fontSize:16,fontWeight:700,color:c,fontFamily:"sans-serif"}}>{v}</div>
              <div style={{fontSize:9,color:"#94a3b8",fontFamily:"sans-serif"}}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <div>
          {/* Form */}
          <div style={{background:"#fff",borderRadius:13,padding:18,marginBottom:14,boxShadow:"0 1px 6px rgba(0,0,0,0.05)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:showForm?14:0}}>
              <h2 style={{margin:0,fontSize:14,fontFamily:"sans-serif",fontWeight:700}}>📖 Revisões por Questões</h2>
              {!showForm&&<button onClick={()=>{setShowForm(true);setEditId(null);setForm({data:tod(),questoes:"",acertos:""}); }}
                style={{padding:"6px 13px",borderRadius:7,border:"none",background:"#3b82f6",color:"#fff",cursor:"pointer",fontSize:11,fontFamily:"sans-serif"}}>+ Registrar</button>}
            </div>
            {showForm&&(
              <div>
                <div style={{fontSize:12,fontWeight:600,color:"#475569",fontFamily:"sans-serif",marginBottom:9}}>{editId!==null?"✏️ Editar revisão":"Nova revisão"}</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:7,marginBottom:9}}>
                  <div><label style={{fontSize:10,color:"#64748b",fontFamily:"sans-serif",display:"block",marginBottom:2}}>Data</label><input type="date" value={form.data} onChange={e=>setForm(f=>({...f,data:e.target.value}))} style={inp}/></div>
                  <div><label style={{fontSize:10,color:"#64748b",fontFamily:"sans-serif",display:"block",marginBottom:2}}>Questões</label><input type="number" value={form.questoes} onChange={e=>setForm(f=>({...f,questoes:e.target.value}))} placeholder="Ex: 30" style={inp}/></div>
                  <div><label style={{fontSize:10,color:"#64748b",fontFamily:"sans-serif",display:"block",marginBottom:2}}>% Acertos</label><input type="number" value={form.acertos} onChange={e=>setForm(f=>({...f,acertos:e.target.value}))} placeholder="0-100" style={inp}/></div>
                </div>
                <div style={{display:"flex",gap:7}}>
                  <button onClick={submit} style={{flex:1,padding:"7px",borderRadius:7,border:"none",background:"#10b981",color:"#fff",cursor:"pointer",fontSize:12,fontFamily:"sans-serif"}}>{editId!==null?"Salvar edição":"Registrar"}</button>
                  <button onClick={()=>{setShowForm(false);setEditId(null);}} style={{padding:"7px 13px",borderRadius:7,border:"1px solid #e2e8f0",background:"#fff",cursor:"pointer",fontSize:12,fontFamily:"sans-serif"}}>Cancelar</button>
                </div>
              </div>
            )}
          </div>

          {/* History */}
          <div style={{background:"#fff",borderRadius:13,padding:18,boxShadow:"0 1px 6px rgba(0,0,0,0.05)"}}>
            <h3 style={{margin:"0 0 12px",fontSize:13,fontFamily:"sans-serif",color:"#475569"}}>Histórico completo</h3>
            {m.revisoes.length===0&&<div style={{color:"#94a3b8",fontSize:11,fontFamily:"sans-serif"}}>Nenhuma revisão registrada ainda.</div>}
            {m.revisoes.map((r,i)=>(
              <div key={r.id} style={{padding:"10px",marginBottom:7,borderRadius:7,background:conf===r.id?"#fef2f2":"#f8fafc",border:`1px solid ${conf===r.id?"#fecaca":"#f1f5f9"}`}}>
                {conf===r.id?(
                  <div style={{fontFamily:"sans-serif"}}>
                    <div style={{fontSize:11,color:"#dc2626",marginBottom:7}}>Confirmar exclusão?</div>
                    <div style={{display:"flex",gap:5}}>
                      <button onClick={()=>{delRev(idx,r.id);setConf(null);}} style={{fontSize:10,padding:"3px 9px",borderRadius:5,border:"none",background:"#ef4444",color:"#fff",cursor:"pointer",fontFamily:"sans-serif"}}>Excluir</button>
                      <button onClick={()=>setConf(null)} style={{fontSize:10,padding:"3px 9px",borderRadius:5,border:"1px solid #e2e8f0",background:"#fff",cursor:"pointer",fontFamily:"sans-serif"}}>Cancelar</button>
                    </div>
                  </div>
                ):(
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div>
                      <div style={{fontSize:11,fontWeight:600,fontFamily:"sans-serif",color:"#1e293b"}}>
                        {i===0?"1º Contato":i===1?"1ª Revisão":i===2?"2ª Revisão":`${i}ª Revisão`} · {fmtD(r.data)}
                      </div>
                      <div style={{fontSize:10,color:"#64748b",fontFamily:"sans-serif",marginTop:1}}>
                        {r.questoes} questões · <span style={{color:r.acertos>=70?"#10b981":r.acertos>=50?"#f59e0b":"#ef4444",fontWeight:600}}>{r.acertos}%</span>
                        {r.proxima&&<> · Próx: {fmtD(r.proxima)}</>}
                      </div>
                    </div>
                    <div style={{display:"flex",gap:3}}>
                      <button onClick={()=>startEdit(r)} style={{fontSize:10,padding:"2px 7px",borderRadius:4,border:"1px solid #e2e8f0",background:"#fff",cursor:"pointer",fontFamily:"sans-serif"}}>✏️</button>
                      <button onClick={()=>setConf(r.id)} style={{fontSize:10,padding:"2px 7px",borderRadius:4,border:"1px solid #fecaca",background:"#fff",cursor:"pointer",fontFamily:"sans-serif",color:"#ef4444"}}>🗑</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {/* General reviews */}
          <div style={{background:"#fff",borderRadius:13,padding:18,boxShadow:"0 1px 6px rgba(0,0,0,0.05)"}}>
            <h3 style={{margin:"0 0 12px",fontSize:14,fontFamily:"sans-serif",fontWeight:700}}>📋 Revisões Gerais</h3>
            {m.revisaoGeral.length===0&&<div style={{color:"#94a3b8",fontSize:11,fontFamily:"sans-serif"}}>Serão geradas ao registrar o 1º estudo.</div>}
            {m.revisaoGeral.map((rg,i)=>{
              const over=isOD(rg.data);const due=isTod(rg.data);
              const bg=rg.status==="feita"?"#f0fdf4":over?"#fef2f2":due?"#eff6ff":"#f8fafc";
              const bc=rg.status==="feita"?"#86efac":over?"#fecaca":due?"#bfdbfe":"#e2e8f0";
              return(
                <div key={rg.id} style={{padding:"9px 11px",marginBottom:7,borderRadius:7,background:bg,border:`1px solid ${bc}`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div>
                      <div style={{fontSize:11,fontWeight:600,fontFamily:"sans-serif"}}>Revisão Geral {i+1}</div>
                      <div style={{fontSize:10,color:"#64748b",fontFamily:"sans-serif"}}>{fmtD(rg.data)}{over&&rg.status!=="feita"&&<span style={{color:"#ef4444"}}> — Atrasada</span>}{due&&rg.status!=="feita"&&<span style={{color:"#3b82f6"}}> — Hoje</span>}</div>
                    </div>
                    {rg.status!=="feita"?(
                      <button onClick={()=>markGen(idx,i,"feita")} style={{fontSize:10,padding:"3px 9px",borderRadius:5,border:"none",background:"#10b981",color:"#fff",cursor:"pointer",fontFamily:"sans-serif"}}>✓ Feita</button>
                    ):<span style={{fontSize:16}}>✅</span>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Temas */}
          <div style={{background:"#fff",borderRadius:13,padding:18,boxShadow:"0 1px 6px rgba(0,0,0,0.05)"}}>
            <h3 style={{margin:"0 0 12px",fontSize:14,fontFamily:"sans-serif",fontWeight:700}}>📑 Temas</h3>
            <div style={{maxHeight:280,overflowY:"auto"}}>
              {m.temas.map((t,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:7,padding:"5px 0",borderBottom:"1px solid #f1f5f9",fontSize:11,fontFamily:"sans-serif",color:"#475569"}}>
                  <span style={{color:"#cbd5e1",fontSize:8}}>●</span>{t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
//  DASHBOARD
// ═══════════════════════════════════════════════
function Dashboard({mods,totalQ,totalRev,concl,gAcc,provas,provaAcc}){
  const studied=mods.filter(m=>m.revisoes.length>0);
  const worst=studied.map(m=>({name:m.name,avg:Math.round(m.revisoes.reduce((s,r)=>s+r.acertos,0)/m.revisoes.length)})).sort((a,b)=>a.avg-b.avg).slice(0,5);
  const best=studied.map(m=>({name:m.name,avg:Math.round(m.revisoes.reduce((s,r)=>s+r.acertos,0)/m.revisoes.length)})).sort((a,b)=>b.avg-a.avg).slice(0,5);
  const sims=provas.filter(p=>p.tipo==="simulado");
  const reals=provas.filter(p=>p.tipo==="prova_real");
  const simAvg=sims.length?Math.round(sims.reduce((s,p)=>p.total?s+(p.acertos/p.total*100):s,0)/sims.length):null;
  const realAvg=reals.length?Math.round(reals.reduce((s,p)=>p.total?s+(p.acertos/p.total*100):s,0)/reals.length):null;

  function areaStats(area){
    const ms=mods.filter(m=>m.area===area);
    const revs=ms.flatMap(m=>m.revisoes);
    const acc=revs.map(r=>r.acertos);
    const avg=acc.length?Math.round(acc.reduce((a,b)=>a+b,0)/acc.length):null;
    return{avg,questoes:revs.reduce((s,r)=>s+r.questoes,0),concl:ms.filter(m=>m.status==="concluido").length,total:ms.length};
  }

  return(
    <div style={{padding:"26px 30px",maxWidth:1060,margin:"0 auto"}}>
      <h1 style={{fontSize:20,fontWeight:700,margin:"0 0 20px",color:"#0f172a"}}>📊 Painel de Desempenho</h1>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:11,marginBottom:20}}>
        {[["Acertos globais",`${gAcc}%`,"#10b981"],["Total questões",totalQ.toLocaleString("pt-BR"),"#3b82f6"],["Total revisões",totalRev,"#8b5cf6"],["Módulos concluídos",concl,"#f59e0b"]].map(([l,v,c])=>(
          <div key={l} style={{background:"#fff",borderRadius:11,padding:"16px 18px",boxShadow:"0 1px 6px rgba(0,0,0,0.05)",borderTop:`3px solid ${c}`}}>
            <div style={{fontSize:28,fontWeight:700,color:c,fontFamily:"sans-serif"}}>{v}</div>
            <div style={{fontSize:10,color:"#64748b",fontFamily:"sans-serif",marginTop:3}}>{l}</div>
          </div>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
        <div style={{background:"#fff",borderRadius:13,padding:20,boxShadow:"0 1px 6px rgba(0,0,0,0.05)"}}>
          <h2 style={{margin:"0 0 14px",fontSize:14,fontFamily:"sans-serif",fontWeight:700}}>Desempenho por Área</h2>
          {AREAS.map(area=>{const s=areaStats(area);return(
            <div key={area} style={{marginBottom:12}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:3,fontFamily:"sans-serif"}}>
                <span style={{fontSize:11,color:"#475569",fontWeight:600}}>{area}</span>
                <span style={{fontSize:11,color:AC[area],fontWeight:700}}>{s.avg!==null?`${s.avg}%`:"—"}</span>
              </div>
              <div style={{background:"#f1f5f9",borderRadius:3,height:5}}>
                <div style={{width:`${s.avg||0}%`,height:"100%",background:AC[area],borderRadius:3}}/>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:2,fontFamily:"sans-serif"}}>
                <span style={{fontSize:9,color:"#94a3b8"}}>{s.questoes} questões</span>
                <span style={{fontSize:9,color:"#94a3b8"}}>{s.concl}/{s.total} módulos</span>
              </div>
            </div>
          );})}
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div style={{background:"#fff",borderRadius:13,padding:20,boxShadow:"0 1px 6px rgba(0,0,0,0.05)",flex:1}}>
            <h3 style={{margin:"0 0 10px",fontSize:13,fontFamily:"sans-serif",color:"#ef4444",fontWeight:700}}>⚠️ Precisa de atenção</h3>
            {worst.length===0&&<div style={{fontSize:11,color:"#94a3b8",fontFamily:"sans-serif"}}>Nenhum dado ainda.</div>}
            {worst.map(m=>(
              <div key={m.name} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid #f1f5f9",fontFamily:"sans-serif"}}>
                <span style={{fontSize:11,color:"#475569"}}>{m.name}</span>
                <span style={{fontSize:11,fontWeight:700,color:"#ef4444"}}>{m.avg}%</span>
              </div>
            ))}
          </div>
          <div style={{background:"#fff",borderRadius:13,padding:20,boxShadow:"0 1px 6px rgba(0,0,0,0.05)",flex:1}}>
            <h3 style={{margin:"0 0 10px",fontSize:13,fontFamily:"sans-serif",color:"#10b981",fontWeight:700}}>💪 Pontos fortes</h3>
            {best.length===0&&<div style={{fontSize:11,color:"#94a3b8",fontFamily:"sans-serif"}}>Nenhum dado ainda.</div>}
            {best.map(m=>(
              <div key={m.name} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid #f1f5f9",fontFamily:"sans-serif"}}>
                <span style={{fontSize:11,color:"#475569"}}>{m.name}</span>
                <span style={{fontSize:11,fontWeight:700,color:"#10b981"}}>{m.avg}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{background:"#fff",borderRadius:13,padding:20,boxShadow:"0 1px 6px rgba(0,0,0,0.05)"}}>
        <h2 style={{margin:"0 0 14px",fontSize:14,fontFamily:"sans-serif",fontWeight:700}}>📝 Provas na Íntegra</h2>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
          {[["Simulados",sims.length,simAvg,"#8b5cf6"],["Provas Reais",reals.length,realAvg,"#3b82f6"],["Geral",provas.length,provaAcc,"#10b981"]].map(([l,n,avg,c])=>(
            <div key={l} style={{background:"#f8fafc",borderRadius:9,padding:"12px 14px",borderLeft:`3px solid ${c}`}}>
              <div style={{fontSize:10,color:"#64748b",fontFamily:"sans-serif",marginBottom:3}}>{l}</div>
              <div style={{fontSize:26,fontWeight:700,color:c,fontFamily:"sans-serif"}}>{avg!==null?`${avg}%`:"—"}</div>
              <div style={{fontSize:10,color:"#94a3b8",fontFamily:"sans-serif"}}>{n} realizados</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
//  PROVAS
// ═══════════════════════════════════════════════
function Provas({provas,saveProva,delProva}){
  const [showF,setShowF]=useState(false);
  const [editIdx,setEditIdx]=useState(null);
  const [form,setForm]=useState({tipo:"simulado",nome:"",data:tod(),total:"",acertos:"",banca:"",notas:""});
  const [conf,setConf]=useState(null);
  const inp={padding:"6px 8px",borderRadius:6,border:"1px solid #e2e8f0",fontSize:12,fontFamily:"sans-serif",width:"100%",boxSizing:"border-box"};

  function open(idx=null){
    if(idx!==null){const p=provas[idx];setForm({tipo:p.tipo,nome:p.nome,data:p.data,total:String(p.total||""),acertos:String(p.acertos||""),banca:p.banca||"",notas:p.notas||""});setEditIdx(idx);}
    else{setForm({tipo:"simulado",nome:"",data:tod(),total:"",acertos:"",banca:"",notas:""});setEditIdx(null);}
    setShowF(true);
  }

  function submit(){
    const t=parseInt(form.total),a=parseInt(form.acertos);
    if(!form.nome||!t||isNaN(a))return;
    saveProva({...form,total:t,acertos:a,pct:t?Math.round((a/t)*100):0},editIdx);
    setShowF(false);setEditIdx(null);
  }

  const Card=({p,i})=>{
    const pct=p.total?Math.round((p.acertos/p.total)*100):0;
    return(
      <div style={{background:"#fff",borderRadius:10,padding:"14px 16px",boxShadow:"0 1px 5px rgba(0,0,0,0.05)",marginBottom:9,borderLeft:`4px solid ${p.tipo==="simulado"?"#8b5cf6":"#3b82f6"}`}}>
        {conf===i?(
          <div style={{fontFamily:"sans-serif"}}>
            <div style={{fontSize:11,color:"#dc2626",marginBottom:7}}>Confirmar exclusão?</div>
            <div style={{display:"flex",gap:5}}>
              <button onClick={()=>{delProva(i);setConf(null);}} style={{fontSize:10,padding:"3px 9px",borderRadius:5,border:"none",background:"#ef4444",color:"#fff",cursor:"pointer",fontFamily:"sans-serif"}}>Excluir</button>
              <button onClick={()=>setConf(null)} style={{fontSize:10,padding:"3px 9px",borderRadius:5,border:"1px solid #e2e8f0",background:"#fff",cursor:"pointer",fontFamily:"sans-serif"}}>Cancelar</button>
            </div>
          </div>
        ):(
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:7}}>
            <div>
              <div style={{fontWeight:600,fontSize:13,fontFamily:"sans-serif",color:"#1e293b"}}>{p.nome}</div>
              <div style={{fontSize:10,color:"#94a3b8",fontFamily:"sans-serif",marginTop:2}}>{fmtD(p.data)}{p.banca&&` · ${p.banca}`}</div>
              {p.notas&&<div style={{fontSize:10,color:"#64748b",fontFamily:"sans-serif",marginTop:3}}>{p.notas}</div>}
            </div>
            <div style={{display:"flex",alignItems:"center",gap:11}}>
              <div style={{textAlign:"center"}}>
                <div style={{fontSize:22,fontWeight:700,fontFamily:"sans-serif",color:pct>=70?"#10b981":pct>=50?"#f59e0b":"#ef4444"}}>{pct}%</div>
                <div style={{fontSize:9,color:"#94a3b8",fontFamily:"sans-serif"}}>{p.acertos}/{p.total}</div>
              </div>
              <div style={{display:"flex",gap:3}}>
                <button onClick={()=>open(i)} style={{fontSize:10,padding:"2px 7px",borderRadius:4,border:"1px solid #e2e8f0",background:"#fff",cursor:"pointer",fontFamily:"sans-serif"}}>✏️</button>
                <button onClick={()=>setConf(i)} style={{fontSize:10,padding:"2px 7px",borderRadius:4,border:"1px solid #fecaca",background:"#fff",cursor:"pointer",fontFamily:"sans-serif",color:"#ef4444"}}>🗑</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const sims=provas.map((p,i)=>({p,i})).filter(({p})=>p.tipo==="simulado");
  const reals=provas.map((p,i)=>({p,i})).filter(({p})=>p.tipo==="prova_real");

  return(
    <div style={{padding:"26px 30px",maxWidth:900,margin:"0 auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <h1 style={{fontSize:20,fontWeight:700,margin:0,color:"#0f172a"}}>📝 Provas na Íntegra</h1>
        <button onClick={()=>open()} style={{padding:"8px 18px",borderRadius:7,border:"none",background:"#3b82f6",color:"#fff",cursor:"pointer",fontSize:12,fontFamily:"sans-serif",fontWeight:600}}>+ Adicionar</button>
      </div>

      {showF&&(
        <div style={{background:"#fff",borderRadius:13,padding:20,marginBottom:18,boxShadow:"0 1px 8px rgba(0,0,0,0.07)"}}>
          <h3 style={{margin:"0 0 14px",fontSize:14,fontFamily:"sans-serif",fontWeight:700}}>{editIdx!==null?"Editar prova":"Nova prova"}</h3>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div><label style={{fontSize:10,color:"#64748b",fontFamily:"sans-serif",display:"block",marginBottom:2}}>Tipo</label>
              <select value={form.tipo} onChange={e=>setForm(f=>({...f,tipo:e.target.value}))} style={{...inp}}>
                <option value="simulado">Simulado</option>
                <option value="prova_real">Prova Real</option>
              </select></div>
            <div><label style={{fontSize:10,color:"#64748b",fontFamily:"sans-serif",display:"block",marginBottom:2}}>Nome</label><input value={form.nome} onChange={e=>setForm(f=>({...f,nome:e.target.value}))} placeholder="Ex: USP 2024" style={inp}/></div>
            <div><label style={{fontSize:10,color:"#64748b",fontFamily:"sans-serif",display:"block",marginBottom:2}}>Data</label><input type="date" value={form.data} onChange={e=>setForm(f=>({...f,data:e.target.value}))} style={inp}/></div>
            <div><label style={{fontSize:10,color:"#64748b",fontFamily:"sans-serif",display:"block",marginBottom:2}}>Banca</label><input value={form.banca} onChange={e=>setForm(f=>({...f,banca:e.target.value}))} placeholder="Ex: USP, ENARE..." style={inp}/></div>
            <div><label style={{fontSize:10,color:"#64748b",fontFamily:"sans-serif",display:"block",marginBottom:2}}>Total de questões</label><input type="number" value={form.total} onChange={e=>setForm(f=>({...f,total:e.target.value}))} placeholder="Ex: 100" style={inp}/></div>
            <div><label style={{fontSize:10,color:"#64748b",fontFamily:"sans-serif",display:"block",marginBottom:2}}>Questões certas</label><input type="number" value={form.acertos} onChange={e=>setForm(f=>({...f,acertos:e.target.value}))} placeholder="Ex: 72" style={inp}/></div>
            <div style={{gridColumn:"1/-1"}}><label style={{fontSize:10,color:"#64748b",fontFamily:"sans-serif",display:"block",marginBottom:2}}>Observações</label><textarea value={form.notas} onChange={e=>setForm(f=>({...f,notas:e.target.value}))} rows={2} style={{...inp,resize:"vertical"}}/></div>
          </div>
          <div style={{display:"flex",gap:7,marginTop:12}}>
            <button onClick={submit} style={{flex:1,padding:"8px",borderRadius:7,border:"none",background:"#10b981",color:"#fff",cursor:"pointer",fontSize:12,fontFamily:"sans-serif",fontWeight:600}}>{editIdx!==null?"Salvar edição":"Adicionar"}</button>
            <button onClick={()=>{setShowF(false);setEditIdx(null);}} style={{padding:"8px 14px",borderRadius:7,border:"1px solid #e2e8f0",background:"#fff",cursor:"pointer",fontSize:12,fontFamily:"sans-serif"}}>Cancelar</button>
          </div>
        </div>
      )}

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
        <div>
          <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:12,padding:"7px 11px",borderRadius:7,background:"#f3f0ff",fontFamily:"sans-serif",fontSize:12,fontWeight:700,color:"#7c3aed"}}>
            🎯 Simulados<span style={{marginLeft:"auto",fontSize:10,background:"#7c3aed",color:"#fff",padding:"1px 7px",borderRadius:10}}>{sims.length}</span>
          </div>
          {sims.length===0&&<div style={{fontSize:11,color:"#94a3b8",fontFamily:"sans-serif"}}>Nenhum simulado registrado.</div>}
          {sims.map(({p,i})=><Card key={p.id||i} p={p} i={i}/>)}
        </div>
        <div>
          <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:12,padding:"7px 11px",borderRadius:7,background:"#eff6ff",fontFamily:"sans-serif",fontSize:12,fontWeight:700,color:"#1d4ed8"}}>
            🏥 Provas Reais<span style={{marginLeft:"auto",fontSize:10,background:"#1d4ed8",color:"#fff",padding:"1px 7px",borderRadius:10}}>{reals.length}</span>
          </div>
          {reals.length===0&&<div style={{fontSize:11,color:"#94a3b8",fontFamily:"sans-serif"}}>Nenhuma prova real registrada.</div>}
          {reals.map(({p,i})=><Card key={p.id||i} p={p} i={i}/>)}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
//  CADERNO DE ERROS — com modo leitura/edição e exportar PDF
// ═══════════════════════════════════════════════
function Caderno({area,setArea,caderno,setCaderno}){
  const edRef=useRef(null);
  const [headings,setHeadings]=useState([]);
  const [saved,setSaved]=useState(true);
  const [mode,setMode]=useState("edit"); // "edit" | "read"
  const timer=useRef(null);

  const getContent=useCallback(()=>caderno[area]||"",[caderno,area]);

  useEffect(()=>{
    if(edRef.current){
      edRef.current.innerHTML=getContent();
      updateH();
    }
  },[area]);

  function updateH(){
    if(!edRef.current)return;
    const els=edRef.current.querySelectorAll("h1,h2,h3");
    setHeadings(Array.from(els).map((el,i)=>({text:el.textContent,tag:el.tagName,id:`h${i}`})));
  }

  function handleInput(){
    setSaved(false);
    if(timer.current)clearTimeout(timer.current);
    timer.current=setTimeout(()=>{
      if(edRef.current){
        setCaderno(c=>({...c,[area]:edRef.current.innerHTML}));
        setSaved(true);
      }
    },700);
    updateH();
  }

  function ex(cmd,val=null){document.execCommand(cmd,false,val);edRef.current?.focus();handleInput();}

  function insTable(){
    const html=`<table style="border-collapse:collapse;width:100%;margin:8px 0"><tr><td style="padding:6px 8px;border:1px solid #e2e8f0;min-width:70px">&nbsp;</td><td style="padding:6px 8px;border:1px solid #e2e8f0;min-width:70px">&nbsp;</td><td style="padding:6px 8px;border:1px solid #e2e8f0;min-width:70px">&nbsp;</td></tr><tr><td style="padding:6px 8px;border:1px solid #e2e8f0">&nbsp;</td><td style="padding:6px 8px;border:1px solid #e2e8f0">&nbsp;</td><td style="padding:6px 8px;border:1px solid #e2e8f0">&nbsp;</td></tr></table><p><br></p>`;
    document.execCommand("insertHTML",false,html);edRef.current?.focus();handleInput();
  }

  function exportPDF(){
    const content=caderno[area]||"";
    const win=window.open("","_blank");
    win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Caderno — ${area}</title>
    <style>
      body{font-family:Georgia,serif;max-width:800px;margin:40px auto;padding:0 40px;color:#1e293b;line-height:1.8;font-size:14px;}
      h1{font-size:22px;font-weight:700;color:#0f172a;margin:24px 0 8px;border-bottom:2px solid #e2e8f0;padding-bottom:6px;}
      h2{font-size:17px;font-weight:700;color:#1e293b;margin:18px 0 6px;}
      h3{font-size:14px;font-weight:700;color:#475569;margin:14px 0 4px;}
      table{border-collapse:collapse;width:100%;margin:8px 0;}
      td,th{border:1px solid #e2e8f0;padding:6px 8px;}
      blockquote{border-left:3px solid #e2e8f0;margin:8px 0;padding:6px 12px;color:#64748b;font-style:italic;}
      ul{padding-left:20px;}ul li{list-style:disc;margin:3px 0;}
      ul ul li{list-style:circle;}ul ul ul li{list-style:square;}
      ol{padding-left:20px;}ol li{list-style:decimal;margin:3px 0;}
      .header{border-bottom:2px solid #3b82f6;padding-bottom:12px;margin-bottom:28px;}
      .area-label{font-size:11px;color:#3b82f6;letter-spacing:2px;font-family:sans-serif;}
      .title{font-size:26px;font-weight:700;color:#0f172a;margin-top:4px;}
      .date{font-size:11px;color:#94a3b8;font-family:sans-serif;margin-top:4px;}
      @media print{body{margin:0;padding:20px;}}
    </style></head><body>
    <div class="header">
      <div class="area-label">${area.toUpperCase()} — CADERNO DE ERROS</div>
      <div class="title">MedStudy</div>
      <div class="date">Exportado em ${new Date().toLocaleDateString("pt-BR")}</div>
    </div>
    ${content||"<p style='color:#94a3b8'>Nenhum conteúdo registrado.</p>"}
    </body></html>`);
    win.document.close();
    setTimeout(()=>{win.print();},500);
  }

  const aCol={"Clínica Médica":"#3b82f6","Clínica Cirúrgica":"#10b981","Pediatria":"#f59e0b","Ginecologia e Obstetrícia":"#ec4899","Preventiva & Social":"#8b5cf6"};
  const bs={padding:"3px 7px",border:"1px solid #e2e8f0",borderRadius:4,background:"#fff",cursor:"pointer",fontSize:11,fontFamily:"sans-serif"};

  return(
    <div style={{display:"flex",height:"100vh",overflow:"hidden"}}>
      {/* Left nav */}
      <div style={{width:190,background:"#fff",borderRight:"1px solid #f1f5f9",display:"flex",flexDirection:"column",flexShrink:0}}>
        <div style={{padding:"14px 13px 10px",borderBottom:"1px solid #f1f5f9"}}>
          <div style={{fontSize:9,letterSpacing:2,color:"#94a3b8",fontFamily:"sans-serif",marginBottom:9}}>CADERNO DE ERROS</div>
          {AREAS.map(a=>(
            <button key={a} onClick={()=>setArea(a)}
              style={{display:"block",width:"100%",textAlign:"left",padding:"7px 9px",borderRadius:5,border:"none",marginBottom:3,cursor:"pointer",background:area===a?`${aCol[a]}12`:"transparent",color:area===a?aCol[a]:"#64748b",fontSize:11,fontFamily:"sans-serif",fontWeight:area===a?700:400,borderLeft:area===a?`2px solid ${aCol[a]}`:"2px solid transparent"}}>
              {a}
            </button>
          ))}
        </div>
        {/* TOC */}
        <div style={{flex:1,padding:"9px 13px",overflowY:"auto"}}>
          <div style={{fontSize:9,letterSpacing:1,color:"#94a3b8",fontFamily:"sans-serif",marginBottom:7}}>ÍNDICE</div>
          {headings.map((h,i)=>(
            <div key={i} style={{fontSize:10,fontFamily:"sans-serif",color:"#64748b",padding:`3px 0 3px ${h.tag==="H2"?"8px":h.tag==="H3"?"16px":"0"}`,cursor:"pointer",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}} title={h.text}>
              {h.text}
            </div>
          ))}
          {headings.length===0&&<div style={{fontSize:9,color:"#cbd5e1",fontFamily:"sans-serif"}}>Crie títulos para navegar</div>}
        </div>
      </div>

      {/* Editor area */}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        {/* Toolbar */}
        <div style={{background:"#fff",borderBottom:"1px solid #f1f5f9",padding:"6px 14px",display:"flex",gap:4,flexWrap:"wrap",alignItems:"center"}}>
          {/* Mode toggle */}
          <div style={{display:"flex",background:"#f1f5f9",borderRadius:6,padding:2,marginRight:6}}>
            <button onClick={()=>setMode("edit")} style={{padding:"3px 10px",borderRadius:4,border:"none",background:mode==="edit"?"#fff":"transparent",color:mode==="edit"?"#1e293b":"#94a3b8",cursor:"pointer",fontSize:11,fontFamily:"sans-serif",fontWeight:mode==="edit"?600:400,boxShadow:mode==="edit"?"0 1px 3px rgba(0,0,0,0.1)":"none"}}>✏️ Editar</button>
            <button onClick={()=>setMode("read")} style={{padding:"3px 10px",borderRadius:4,border:"none",background:mode==="read"?"#fff":"transparent",color:mode==="read"?"#1e293b":"#94a3b8",cursor:"pointer",fontSize:11,fontFamily:"sans-serif",fontWeight:mode==="read"?600:400,boxShadow:mode==="read"?"0 1px 3px rgba(0,0,0,0.1)":"none"}}>👁 Leitura</button>
          </div>

          {mode==="edit"&&<>
            <select onChange={e=>{ex("formatBlock",e.target.value);e.target.value="p";}} defaultValue="p" style={{...bs,padding:"3px 5px"}}>
              <option value="p">Normal</option>
              <option value="h1">Título 1</option>
              <option value="h2">Título 2</option>
              <option value="h3">Título 3</option>
            </select>
            <select onChange={e=>ex("fontSize",e.target.value)} defaultValue="3" style={{...bs,padding:"3px 5px"}}>
              {[1,2,3,4,5,6,7].map(s=><option key={s} value={s}>{["","Pequeno","","Médio","","Grande","","Enorme"][s]||s}</option>)}
            </select>
            {[["bold","B",700],["italic","I",400,"italic"],["underline","U",400,"normal","underline"]].map(([cmd,lbl,fw,fi,td])=>(
              <button key={cmd} onClick={()=>ex(cmd)} style={{...bs,fontWeight:fw,fontStyle:fi,textDecoration:td}}>{lbl}</button>
            ))}
            <input type="color" onChange={e=>ex("foreColor",e.target.value)} title="Cor do texto" style={{width:22,height:22,border:"1px solid #e2e8f0",borderRadius:3,cursor:"pointer",padding:1}}/>
            <input type="color" onChange={e=>ex("hiliteColor",e.target.value)} title="Marca-texto" defaultValue="#fef08a" style={{width:22,height:22,border:"1px solid #e2e8f0",borderRadius:3,cursor:"pointer",padding:1,background:"#fef9c3"}}/>
            <div style={{width:1,height:18,background:"#e2e8f0",margin:"0 1px"}}/>
            {[["justifyLeft","⬅"],["justifyCenter","⬛"],["justifyRight","➡"]].map(([cmd,ic])=>(
              <button key={cmd} onClick={()=>ex(cmd)} style={bs}>{ic}</button>
            ))}
            <div style={{width:1,height:18,background:"#e2e8f0",margin:"0 1px"}}/>
            <button onClick={()=>ex("insertUnorderedList")} style={bs}>• Lista</button>
            <button onClick={()=>ex("insertOrderedList")} style={bs}>1. Lista</button>
            <button onClick={()=>ex("indent")} style={bs}>→</button>
            <button onClick={()=>ex("outdent")} style={bs}>←</button>
            <div style={{width:1,height:18,background:"#e2e8f0",margin:"0 1px"}}/>
            <button onClick={insTable} style={bs}>⊞ Tabela</button>
            <button onClick={()=>ex("insertHorizontalRule")} style={bs}>── Linha</button>
            <button onClick={()=>{document.execCommand("insertHTML",false,`<blockquote style="border-left:3px solid #e2e8f0;margin:8px 0;padding:6px 12px;color:#64748b;font-style:italic">Citação</blockquote>`);handleInput();}} style={bs}>❝</button>
            <div style={{width:1,height:18,background:"#e2e8f0",margin:"0 1px"}}/>
            <button onClick={()=>ex("undo")} style={bs} title="Ctrl+Z">↩</button>
            <button onClick={()=>ex("redo")} style={bs} title="Ctrl+Y">↪</button>
            <div style={{fontSize:10,color:saved?"#94a3b8":"#f59e0b",fontFamily:"sans-serif",marginLeft:"auto"}}>{saved?"✓ Salvo":"Salvando..."}</div>
          </>}

          {mode==="read"&&<div style={{marginLeft:"auto"}}/>}

          {/* Export PDF button — always visible */}
          <button onClick={exportPDF}
            style={{padding:"4px 11px",borderRadius:6,border:"none",background:"#ef4444",color:"#fff",cursor:"pointer",fontSize:11,fontFamily:"sans-serif",fontWeight:600,display:"flex",alignItems:"center",gap:4,marginLeft:mode==="read"?"auto":6}}>
            📄 Exportar PDF
          </button>
        </div>

        {/* Content area */}
        <div style={{flex:1,overflow:"auto",padding:"22px 36px",background:"#fafafa"}}>
          {mode==="read"?(
            // READ MODE
            <div style={{maxWidth:740,margin:"0 auto",background:"#fff",borderRadius:8,boxShadow:"0 1px 8px rgba(0,0,0,0.06)",minHeight:600,padding:"36px 44px"}}>
              <div style={{fontSize:10,color:aCol[area],fontFamily:"sans-serif",marginBottom:6,letterSpacing:2}}>{area.toUpperCase()}</div>
              <div
                style={{fontSize:14,lineHeight:1.85,color:"#1e293b",fontFamily:"Georgia,serif"}}
                dangerouslySetInnerHTML={{__html:getContent()||`<p style="color:#cbd5e1;font-style:italic">Nenhum conteúdo registrado para ${area}.</p>`}}
              />
            </div>
          ):(
            // EDIT MODE
            <div style={{maxWidth:740,margin:"0 auto",background:"#fff",borderRadius:8,boxShadow:"0 1px 8px rgba(0,0,0,0.06)",minHeight:600,padding:"36px 44px"}}>
              <div style={{fontSize:10,color:aCol[area],fontFamily:"sans-serif",marginBottom:6,letterSpacing:2}}>{area.toUpperCase()}</div>
              <div
                ref={edRef}
                contentEditable={true}
                suppressContentEditableWarning={true}
                onInput={handleInput}
                onKeyDown={e=>{
                  if(e.key==="Tab"){e.preventDefault();ex("indent");}
                  if((e.ctrlKey||e.metaKey)&&e.key==="z"){e.preventDefault();ex("undo");}
                  if((e.ctrlKey||e.metaKey)&&(e.key==="y"||(e.shiftKey&&e.key==="z"))){e.preventDefault();ex("redo");}
                }}
                data-placeholder="Comece a escrever seus erros e anotações aqui..."
                style={{outline:"none",minHeight:500,fontSize:14,lineHeight:1.85,color:"#1e293b",fontFamily:"Georgia,serif"}}
              />
            </div>
          )}
        </div>
      </div>

      <style>{`
        [contenteditable]:empty:before{content:attr(data-placeholder);color:#cbd5e1;pointer-events:none;}
        [contenteditable] h1{font-size:22px;font-weight:700;color:#0f172a;margin:20px 0 8px;border-bottom:2px solid #f1f5f9;padding-bottom:5px;}
        [contenteditable] h2{font-size:17px;font-weight:700;color:#1e293b;margin:16px 0 5px;}
        [contenteditable] h3{font-size:14px;font-weight:700;color:#475569;margin:12px 0 4px;}
        [contenteditable] ul{padding-left:20px;margin:5px 0;}
        [contenteditable] ul li{list-style:disc;margin:3px 0;}
        [contenteditable] ul ul{padding-left:18px;}
        [contenteditable] ul ul li{list-style:circle;}
        [contenteditable] ul ul ul li{list-style:square;}
        [contenteditable] ol{padding-left:20px;margin:5px 0;}
        [contenteditable] ol li{list-style:decimal;margin:3px 0;}
        [contenteditable] ol ol li{list-style:lower-alpha;}
        [contenteditable] ol ol ol li{list-style:lower-roman;}
        [contenteditable] table{border-collapse:collapse;width:100%;margin:8px 0;}
        [contenteditable] td,[contenteditable] th{border:1px solid #e2e8f0;padding:6px 8px;min-width:60px;}
        [contenteditable] blockquote{border-left:3px solid #e2e8f0;margin:8px 0;padding:6px 12px;color:#64748b;font-style:italic;}
        [contenteditable] hr{border:none;border-top:1px solid #e2e8f0;margin:12px 0;}
        [contenteditable] p{margin:4px 0;}
      `}</style>
    </div>
  );
}
