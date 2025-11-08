import ManualEntry from "./ManualEntry";
import UploadView from "./UploadView";

export default function CvInputSection({
  activeTab,
}: {
  activeTab: "upload" | "manual";
}) {
  return (
    <div>
      {activeTab === "upload" && <UploadView />}
      {activeTab === "manual" && <ManualEntry />}
    </div>
  );
}
