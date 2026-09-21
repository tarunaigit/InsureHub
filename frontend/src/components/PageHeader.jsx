export default function PageHeader({eyebrow,title,subtitle,actions}){
 return <div className="page-header">
   <div>
     <span className="eyebrow">{eyebrow}</span>
     <h1>{title}</h1>
     {subtitle&&<p>{subtitle}</p>}
   </div>
   {actions&&<div className="page-actions">{actions}</div>}
 </div>
}
