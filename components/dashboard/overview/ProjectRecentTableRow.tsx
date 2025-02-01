import Image from "next/image";
import Link from "next/link";
import { TableCell, TableRow } from "@/components/ui/table";
import { Project } from "@prisma/client";

const ProjectRecentTableRow = ({ project }: { project: Project }) => {
  return (
    <TableRow key={project.id} className="">
      <TableCell className="w-[80px] sm:w-[100px]">
        <Link target="_blank" href={`/project/${project.slug}`}>
          <div className="shrink-0">
            <Image
              alt={project.name}
              className="aspect-square rounded-md object-cover"
              height={50}
              width={50}
              src={project.thumbnail ?? ""}
            />
          </div>
        </Link>
      </TableCell>
      <TableCell className="w-full">
        <Link target="_blank" href={`/project/${project.slug}`}>
          <div className="font-medium">{project.name}</div>
          <div className="hidden text-sm text-muted-foreground md:inline line-clamp-3">
            {project.description}
          </div>
        </Link>
      </TableCell>
    </TableRow>
  );
};

export default ProjectRecentTableRow;
